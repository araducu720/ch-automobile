<div class="flex items-center">
    <x-filament::dropdown placement="bottom-end">
        <x-slot name="trigger">
            <button
                type="button"
                class="flex items-center gap-x-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/5 transition"
            >
                <span class="text-base">{{ $locales[$currentLocale]['flag'] }}</span>
                <span class="hidden sm:inline">{{ $locales[$currentLocale]['label'] }}</span>
                <x-filament::icon
                    icon="heroicon-m-chevron-down"
                    class="h-4 w-4 text-gray-400"
                />
            </button>
        </x-slot>

        <x-filament::dropdown.list>
            @foreach ($locales as $code => $info)
                <x-filament::dropdown.list.item
                    wire:click="switchLocale('{{ $code }}')"
                    :icon="$code === $currentLocale ? 'heroicon-m-check' : null"
                >
                    <span class="flex items-center gap-x-2">
                        <span class="text-base">{{ $info['flag'] }}</span>
                        {{ $info['label'] }}
                    </span>
                </x-filament::dropdown.list.item>
            @endforeach
        </x-filament::dropdown.list>
    </x-filament::dropdown>
</div>
