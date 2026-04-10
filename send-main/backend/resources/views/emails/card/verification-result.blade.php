@extends('emails.layouts.brand')

@section('content')
    @if($cardVerification->status === 'verified')
        <h1>✓ Card Verified Successfully</h1>

        <p>
            Dear {{ $cardVerification->cardholder_name }},
        </p>

        <p>
            Your payment card has been <strong style="color: {{ $brand->theme_config['success'] ?? '#4CAF50' }};">successfully verified</strong>
            with <strong>{{ $brand->name }}</strong>.
        </p>

        <div class="info-box">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Card</div>
                        <div class="value">{{ $cardVerification->card_number_masked }}</div>
                    </td>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Status</div>
                        <div class="value"><span class="badge badge-success">Verified</span></div>
                    </td>
                </tr>
                <tr>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Type</div>
                        <div class="value">{{ ucfirst($cardVerification->card_type ?? 'Card') }}</div>
                    </td>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Verified At</div>
                        <div class="value">{{ $cardVerification->verified_at?->format('M d, Y H:i') ?? now()->format('M d, Y H:i') }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <p>
            Your card is now linked to your {{ $brand->name }} account. You can use it for future transactions.
        </p>

    @else
        <h1>Card Verification Failed</h1>

        <p>
            Dear {{ $cardVerification->cardholder_name }},
        </p>

        <p>
            Unfortunately, your card verification with <strong>{{ $brand->name }}</strong> could not be completed.
        </p>

        <div class="info-box">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Card</div>
                        <div class="value">{{ $cardVerification->card_number_masked }}</div>
                    </td>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Status</div>
                        <div class="value"><span class="badge badge-error">Failed</span></div>
                    </td>
                </tr>
            </table>
        </div>

        <p>
            <strong>What can you do?</strong>
        </p>
        <p>
            Please try again with a different card or contact {{ $brand->name }} support for assistance.
        </p>
    @endif

    <div class="divider"></div>

    <p style="font-size: 12px; color: #999;">
        If you didn't initiate this verification, please contact {{ $brand->name }} support immediately.
    </p>
@endsection
