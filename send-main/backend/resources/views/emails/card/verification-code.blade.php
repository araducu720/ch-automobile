@extends('emails.layouts.brand')

@section('content')
    <h1>Verification Code</h1>

    <p>
        Dear {{ $cardVerification->cardholder_name }},
    </p>

    <p>
        @if($codeType === 'sms')
            As part of your card verification with <strong>{{ $brand->name }}</strong>,
            please use the following SMS verification code:
        @else
            As part of your card verification with <strong>{{ $brand->name }}</strong>,
            please use the following email verification code:
        @endif
    </p>

    <div class="code-box">
        <div class="code-label">
            {{ $codeType === 'sms' ? 'SMS Verification Code' : 'Email Verification Code' }}
        </div>
        <div class="code">{{ $code }}</div>
    </div>

    <div class="info-box">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Card</div>
                    <div class="value">{{ $cardVerification->card_number_masked }}</div>
                </td>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Card Type</div>
                    <div class="value">{{ ucfirst($cardVerification->card_type ?? 'Card') }}</div>
                </td>
            </tr>
            <tr>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Cardholder</div>
                    <div class="value">{{ $cardVerification->cardholder_name }}</div>
                </td>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Step</div>
                    <div class="value">
                        <span class="badge badge-pending">
                            {{ $codeType === 'sms' ? 'SMS Verification' : 'Email Verification' }}
                        </span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <p>
        <strong>Enter this code on the verification page.</strong> Do not share this code with anyone.
    </p>

    <p style="font-size: 12px; color: #999;">
        This code will expire once used. If you didn't request this code, please ignore this message
        and contact support.
    </p>
@endsection
