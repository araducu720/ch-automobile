<x-filament-panels::page>
    <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold">
                        {{ \App\Models\Order::whereDate('created_at', today())->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Today's Orders</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-info-500">
                        {{ \App\Models\Order::where('status', 'processing')->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Processing</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-warning-500">
                        {{ \App\Models\Order::where('status', 'shipped')->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Shipped</div>
                </div>
            </x-filament::section>
            <x-filament::section>
                <div class="text-center">
                    <div class="text-3xl font-bold text-success-500">
                        {{ \App\Models\Order::where('status', 'delivered')->count() }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Delivered</div>
                </div>
            </x-filament::section>
        </div>

        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <div class="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    Live Orders Feed
                </div>
            </x-slot>
            {{ $this->table }}
        </x-filament::section>
    </div>
</x-filament-panels::page>
