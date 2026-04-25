<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ollama Host
    |--------------------------------------------------------------------------
    | The base URL for the locally-running Ollama instance.
    */
    'host' => env('OLLAMA_HOST', 'http://127.0.0.1:11434'),

    /*
    |--------------------------------------------------------------------------
    | Default text-generation model
    |--------------------------------------------------------------------------
    | Good multilingual model for European languages (ro, de, en, fr, it).
    */
    'model' => env('OLLAMA_MODEL', 'qwen2.5:7b'),

    /*
    |--------------------------------------------------------------------------
    | Vision model (optional)
    |--------------------------------------------------------------------------
    | Used for car photo analysis. Only loaded if VRAM >= 16 GB.
    */
    'vision' => env('OLLAMA_VISION_MODEL', 'llama3.2-vision:11b'),

    /*
    |--------------------------------------------------------------------------
    | Embedding model
    |--------------------------------------------------------------------------
    | Used for semantic search / RAG (Retrieval-Augmented Generation).
    */
    'embed' => env('OLLAMA_EMBED_MODEL', 'nomic-embed-text'),

    /*
    |--------------------------------------------------------------------------
    | Request timeout (seconds)
    |--------------------------------------------------------------------------
    | LLM inference can be slow on a single GPU; 120s is a safe default.
    */
    'timeout' => (int) env('OLLAMA_TIMEOUT', 120),
];
