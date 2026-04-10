@extends('emails.layouts.brand')

@section('content')
    @if($verification->status === 'approved')
        <h1>✓ Verification Approved</h1>

        <p>
            Dear {{ $verification->first_name }},
        </p>

        <p>
            Great news! Your identity verification for <strong>{{ $brand->name }}</strong> has been
            <strong style="color: {{ $brand->theme_config['success'] ?? '#4CAF50' }};">approved</strong>.
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
                        <div class="value"><span class="badge badge-success">Approved</span></div>
                    </td>
                </tr>
                @if($verification->confidence_score)
                <tr>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Confidence Score</div>
                        <div class="value">{{ $verification->confidence_score }}%</div>
                    </td>
                    <td width="50%" style="padding: 8px 0;">
                        <div class="label">Reviewed</div>
                        <div class="value">{{ $verification->reviewed_at?->format('M d, Y H:i') ?? 'N/A' }}</div>
                    </td>
                </tr>
                @endif
            </table>
        </div>

        <p>
            You can now access all features of your {{ $brand->name }} account. No further action is required.
        </p>

    @elseif($verification->status === 'rejected')
        <h1>Verification Requires Attention</h1>

        <p>
            Dear {{ $verification->first_name }},
        </p>

        <p>
            Unfortunately, your identity verification for <strong>{{ $brand->name }}</strong> could not be
            completed at this time.
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
                        <div class="value"><span class="badge badge-error">Rejected</span></div>
                    </td>
                </tr>
                @if($verification->rejection_reason)
                <tr>
                    <td colspan="2" style="padding: 12px 0;">
                        <div class="label">Reason</div>
                        <div class="value" style="margin-top: 4px; padding: 12px; background: {{ $brand->theme_config['error'] ?? '#F44336' }}08; border-radius: 6px; border-left: 3px solid {{ $brand->theme_config['error'] ?? '#F44336' }};">
                            {{ $verification->rejection_reason }}
                        </div>
                    </td>
                </tr>
                @endif
            </table>
        </div>

        <p>
            <strong>What can you do?</strong>
        </p>
        <p>
            Please review the reason above and consider resubmitting your verification with updated information
            or clearer documents.
        </p>

    @elseif($verification->status === 'in_review')
        <h1>Verification Under Review</h1>

        <p>
            Dear {{ $verification->first_name }},
        </p>

        <p>
            Your identity verification for <strong>{{ $brand->name }}</strong> is now being reviewed by our team.
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
                        <div class="value"><span class="badge badge-pending">In Review</span></div>
                    </td>
                </tr>
            </table>
        </div>

        <p>
            This process usually takes a few minutes. You'll receive another email once the review is complete.
        </p>
    @endif

    <div class="divider"></div>

    <p style="font-size: 12px; color: #999;">
        If you have questions about this verification, please contact {{ $brand->name }} support.
    </p>
@endsection
