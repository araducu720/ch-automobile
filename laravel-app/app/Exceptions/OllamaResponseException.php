<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Thrown when the Ollama API returns an invalid or unparseable JSON response.
 */
class OllamaResponseException extends RuntimeException {}
