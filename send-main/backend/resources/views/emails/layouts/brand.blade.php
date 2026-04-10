<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $brand->name }}</title>
    <style>
        /* Reset */
        body, table, td, p { margin: 0; padding: 0; }
        body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        table { border-collapse: collapse !important; }

        /* Brand Colors - Dynamic */
        :root {
            --brand-primary: {{ $brand->primary_color }};
            --brand-secondary: {{ $brand->secondary_color }};
        }

        /* Base */
        body {
            font-family: {{ $brand->font_family ?? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }};
            background-color: #f4f4f4;
            color: {{ $brand->theme_config['text_primary'] ?? '#333333' }};
            line-height: 1.6;
        }

        .email-wrapper {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        /* Header */
        .email-header {
            background-color: {{ $brand->primary_color }};
            padding: 24px 32px;
            text-align: center;
        }

        .email-header .brand-name {
            color: {{ $brand->theme_config['header_text'] ?? '#FFFFFF' }};
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        /* Body */
        .email-body {
            padding: 32px;
        }

        .email-body h1 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 16px;
            color: {{ $brand->theme_config['text_primary'] ?? '#333333' }};
        }

        .email-body p {
            font-size: 14px;
            color: {{ $brand->theme_config['text_secondary'] ?? '#666666' }};
            margin-bottom: 16px;
            line-height: 1.7;
        }

        /* Action Button */
        .email-btn {
            display: inline-block;
            padding: 12px 32px;
            background-color: {{ $brand->primary_color }};
            color: {{ $brand->theme_config['header_text'] ?? '#FFFFFF' }} !important;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            border-radius: {{ $brand->theme_config['button_radius'] ?? '4px' }};
            margin: 8px 0;
        }

        /* Info Box */
        .info-box {
            background-color: {{ $brand->theme_config['bg_light'] ?? '#F5F5F5' }};
            border: 1px solid {{ $brand->theme_config['border'] ?? '#E0E0E0' }};
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }

        .info-box .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: {{ $brand->theme_config['text_secondary'] ?? '#666666' }};
            margin-bottom: 4px;
        }

        .info-box .value {
            font-size: 14px;
            font-weight: 600;
            color: {{ $brand->theme_config['text_primary'] ?? '#333333' }};
        }

        /* Success/Error Badges */
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-success {
            background-color: {{ $brand->theme_config['success'] ?? '#4CAF50' }}15;
            color: {{ $brand->theme_config['success'] ?? '#4CAF50' }};
        }

        .badge-error {
            background-color: {{ $brand->theme_config['error'] ?? '#F44336' }}15;
            color: {{ $brand->theme_config['error'] ?? '#F44336' }};
        }

        .badge-pending {
            background-color: {{ $brand->primary_color }}15;
            color: {{ $brand->primary_color }};
        }

        /* Code Box */
        .code-box {
            text-align: center;
            padding: 24px;
            margin: 24px 0;
            background-color: {{ $brand->theme_config['bg_light'] ?? '#F5F5F5' }};
            border: 2px dashed {{ $brand->primary_color }};
            border-radius: 12px;
        }

        .code-box .code {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            color: {{ $brand->primary_color }};
            font-family: 'Courier New', monospace;
        }

        .code-box .code-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: {{ $brand->theme_config['text_secondary'] ?? '#666666' }};
            margin-bottom: 8px;
        }

        /* Divider */
        .divider {
            height: 1px;
            background-color: {{ $brand->theme_config['border'] ?? '#E0E0E0' }};
            margin: 24px 0;
        }

        /* Footer */
        .email-footer {
            padding: 24px 32px;
            background-color: {{ $brand->theme_config['bg_light'] ?? '#F5F5F5' }};
            text-align: center;
            border-top: 1px solid {{ $brand->theme_config['border'] ?? '#E0E0E0' }};
        }

        .email-footer p {
            font-size: 12px;
            color: {{ $brand->theme_config['text_secondary'] ?? '#999999' }};
            margin-bottom: 4px;
        }

        /* Brand-specific overrides */
        @if($brand->slug === 'walmart')
        .email-header { background-color: #0071CE; }
        .email-btn { background-color: #0071CE; border-radius: 4px; }
        @elseif($brand->slug === 'amazon')
        .email-header { background-color: #232F3E; }
        .email-btn { background-color: #FF9900; color: #0F1111 !important; border-radius: 8px; }
        @elseif($brand->slug === 'dpd')
        .email-header { background-color: #DC0032; }
        .email-btn { background-color: #DC0032; border-radius: 6px; }
        @elseif($brand->slug === 'dhl')
        .email-header { background-color: #FFCC00; }
        .email-header .brand-name { color: #D40511; }
        .email-btn { background-color: #D40511; color: #FFFFFF !important; border-radius: 0; text-transform: uppercase; font-weight: 800; }
        @endif
    </style>
</head>
<body style="background-color: #f4f4f4; padding: 20px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table role="presentation" class="email-wrapper" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    <!-- Header -->
                    <tr>
                        <td class="email-header">
                            @if($brand->logo_url)
                                <img src="{{ config('app.url') }}{{ $brand->logo_url }}" alt="{{ $brand->name }}" height="36" style="margin-bottom: 8px;">
                            @endif
                            <div class="brand-name">{{ $brand->name }}</div>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="email-body">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="email-footer">
                            <p>&copy; {{ date('Y') }} {{ $brand->name }}. All rights reserved.</p>
                            <p>This is an automated message. Please do not reply.</p>
                            @yield('footer-extra')
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
