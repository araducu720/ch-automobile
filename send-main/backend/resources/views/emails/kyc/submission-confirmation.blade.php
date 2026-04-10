@extends('emails.layouts.brand')

@section('content')
    <h1>Verification Received</h1>

    <p>
        Dear {{ $verification->first_name }},
    </p>

    <p>
        Thank you for submitting your identity verification for <strong>{{ $brand->name }}</strong>.
        We have received your information and will review it shortly.
    </p>

    <div class="info-box">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Reference</div>
                    <div class="value">{{ strtoupper(substr($verification->uuid, 0, 8)) }}</div>
                </td>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Status</div>
                    <div class="value"><span class="badge badge-pending">Pending Review</span></div>
                </td>
            </tr>
            <tr>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Full Name</div>
                    <div class="value">{{ $verification->first_name }} {{ $verification->last_name }}</div>
                </td>
                <td width="50%" style="padding: 8px 0;">
                    <div class="label">Submitted</div>
                    <div class="value">{{ $verification->created_at->format('M d, Y H:i') }}</div>
                </td>
            </tr>
            @if($verification->document_type)
            <tr>
                <td colspan="2" style="padding: 8px 0;">
                    <div class="label">Document Type</div>
                    <div class="value">{{ ucwords(str_replace('_', ' ', $verification->document_type)) }}</div>
                </td>
            </tr>
            @endif
        </table>
    </div>

    <p>
        <strong>What happens next?</strong>
    </p>
    <p>
        Our verification team will review your submission. This usually takes a few minutes.
        You'll receive an email notification once the review is complete.
    </p>

    <div class="divider"></div>

    <p style="font-size: 12px; color: #999;">
        If you didn't submit this verification, please contact our support team immediately.
    </p>
@endsection
