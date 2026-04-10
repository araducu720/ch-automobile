<x-filament-panels::page>
    <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-warning-500">
                        {{ \App\Models\KycVerification::where('status', 'pending')->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Pending</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-info-500">
                        {{ \App\Models\KycVerification::where('status', 'in_review')->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">In Review</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-success-500">
                        {{ \App\Models\KycVerification::where('status', 'approved')->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Approved</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-danger-500">
                        {{ \App\Models\KycVerification::where('status', 'rejected')->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Rejected</div>
                </div>
            </x-filament::section>
        </div>

        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <div class="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    Live KYC Verifications
                </div>
            </x-slot>
            {{ $this->table }}
        </x-filament::section>
    </div>
</x-filament-panels::page>
