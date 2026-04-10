"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { BrandConfig } from "@/lib/brandConfig";

interface BiometricCheckProps {
  brandConfig: BrandConfig;
  onCapture: (file: File) => void;
  existingImage?: string | null;
}

type CaptureStep = "ready" | "positioning" | "capturing" | "captured" | "error";

export default function BiometricCheck({ brandConfig, onCapture, existingImage }: BiometricCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [step, setStep] = useState<CaptureStep>(existingImage ? "captured" : "ready");
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStep("positioning");
    } catch {
      setErrorMsg("Camera access denied. Please allow camera permissions and try again.");
      setStep("error");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setStep("capturing");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror image for selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setPreview(url);
        onCapture(file);
        setStep("captured");
        stopCamera();
      }
    }, "image/jpeg", 0.9);
  };

  const retake = () => {
    setPreview(null);
    setStep("ready");
  };

  return (
    <div>
      <label className="kyc-label">Biometric Selfie Verification</label>

      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: `1px solid ${brandConfig.border}`,
          backgroundColor: brandConfig.bgLight,
        }}
      >
        {/* Camera / Preview area */}
        <div
          className="relative bg-black flex items-center justify-center"
          style={{ minHeight: "300px" }}
        >
          {step === "ready" && (
            <div className="text-center py-12 px-4">
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${brandConfig.primaryColor}15`,
                  border: `2px dashed ${brandConfig.primaryColor}40`,
                }}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={brandConfig.primaryColor} strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold" style={{ color: brandConfig.textPrimary }}>
                Take a Selfie Photo
              </h3>
              <p className="text-xs mt-1 max-w-xs mx-auto" style={{ color: brandConfig.textSecondary }}>
                We&apos;ll match your face with the photo on your ID document.
                Make sure you&apos;re in a well-lit area.
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="kyc-btn-primary mt-4 gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open Camera
              </button>
            </div>
          )}

          {(step === "positioning" || step === "capturing") && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)", maxHeight: "360px" }}
              />
              {/* Face outline guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-48 h-60 border-2 border-dashed rounded-full"
                  style={{
                    borderColor: step === "capturing" ? brandConfig.success : `${brandConfig.primaryColor}80`,
                  }}
                />
              </div>
              {/* Guide text */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "#FFFFFF",
                  }}
                >
                  Position your face within the oval
                </span>
              </div>
            </>
          )}

          {step === "captured" && preview && (
            <img
              src={preview}
              alt="Captured selfie"
              className="w-full h-full object-cover"
              style={{ maxHeight: "360px" }}
            />
          )}

          {step === "error" && (
            <div className="text-center py-12 px-4">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${brandConfig.error}15` }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={brandConfig.error} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: brandConfig.error }}>
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={() => setStep("ready")}
                className="kyc-btn-secondary mt-3"
              >
                Try Again
              </button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action buttons */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ borderTop: `1px solid ${brandConfig.border}` }}
        >
          {step === "positioning" && (
            <>
              <button type="button" onClick={() => { stopCamera(); setStep("ready"); }} className="kyc-btn-secondary text-sm">
                Cancel
              </button>
              <button type="button" onClick={capturePhoto} className="kyc-btn-primary text-sm gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
                Capture
              </button>
            </>
          )}

          {step === "captured" && (
            <>
              <button type="button" onClick={retake} className="kyc-btn-secondary text-sm">
                Retake
              </button>
              <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: brandConfig.success }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Photo captured successfully
              </div>
            </>
          )}

          {step === "ready" && !existingImage && (
            <div className="w-full text-center">
              <span className="text-xs" style={{ color: brandConfig.textSecondary }}>
                Camera access is required for biometric verification
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { icon: "💡", tip: "Good lighting" },
          { icon: "🚫", tip: "No glasses" },
          { icon: "😐", tip: "Neutral face" },
        ].map((item) => (
          <div
            key={item.tip}
            className="text-center py-2 px-1 rounded text-xs"
            style={{
              backgroundColor: brandConfig.bgLight,
              color: brandConfig.textSecondary,
            }}
          >
            <span className="text-base block mb-0.5">{item.icon}</span>
            {item.tip}
          </div>
        ))}
      </div>
    </div>
  );
}
