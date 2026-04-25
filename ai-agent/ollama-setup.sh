#!/usr/bin/env bash
# =============================================================================
# C-H Automobile — Ollama Setup Script
# Idempotent installer for the local AI inference runtime.
#
# Usage:  bash ai-agent/ollama-setup.sh
#
# What it does:
#  1. Installs Ollama via the official script (skips if already installed).
#  2. Configures Ollama to bind only on 127.0.0.1 (not publicly accessible).
#  3. Blocks external access via ufw (if available).
#  4. Pulls the required models:
#       - qwen2.5:7b           (multilingual text generation)
#       - nomic-embed-text     (semantic embeddings / RAG)
#       - llama3.2-vision:11b  (optional — only if RAM >= 24 GB)
#  5. Enables and starts the systemd service.
# =============================================================================
set -euo pipefail

OLLAMA_BIN="/usr/local/bin/ollama"
SYSTEMD_OVERRIDE_DIR="/etc/systemd/system/ollama.service.d"
SYSTEMD_OVERRIDE_FILE="${SYSTEMD_OVERRIDE_DIR}/override.conf"

# ─── Colours ─────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Colour

info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warning() { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERR]${NC}   $*" >&2; }

# ─── 1. Install Ollama ───────────────────────────────────────────────────────
if command -v ollama &>/dev/null; then
    info "Ollama is already installed: $(ollama --version 2>/dev/null || echo 'version unknown')"
else
    info "Installing Ollama via official installer..."
    curl -fsSL https://ollama.com/install.sh | sh
    info "Ollama installed successfully."
fi

# ─── 2. Configure Ollama to bind on 127.0.0.1 only ──────────────────────────
info "Configuring Ollama to bind on 127.0.0.1:11434 only..."

mkdir -p "${SYSTEMD_OVERRIDE_DIR}"

cat > "${SYSTEMD_OVERRIDE_FILE}" <<'EOF'
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
EOF

systemctl daemon-reload

info "Systemd override written to ${SYSTEMD_OVERRIDE_FILE}."

# ─── 3. Block external access via ufw ───────────────────────────────────────
if command -v ufw &>/dev/null; then
    info "Blocking external access to port 11434 via ufw..."
    ufw deny 11434/tcp 2>/dev/null || true
    info "ufw rule added (deny 11434)."
else
    warning "ufw not found — ensure port 11434 is not exposed via your firewall."
fi

# ─── 4. Enable and start Ollama service ─────────────────────────────────────
info "Enabling and starting Ollama service..."
systemctl enable ollama
systemctl restart ollama

# Give the service a moment to start
sleep 3

if systemctl is-active --quiet ollama; then
    info "Ollama service is running."
else
    error "Ollama service failed to start. Check: journalctl -u ollama -n 50"
    exit 1
fi

# ─── 5. Pull models ──────────────────────────────────────────────────────────
info "Pulling qwen2.5:7b (multilingual generation)..."
ollama pull qwen2.5:7b

info "Pulling nomic-embed-text (embeddings / RAG)..."
ollama pull nomic-embed-text

# Detect available RAM (in GB)
TOTAL_RAM_GB=$(awk '/MemTotal/ {printf "%d", $2/1024/1024}' /proc/meminfo 2>/dev/null || echo 0)
info "Detected RAM: ${TOTAL_RAM_GB} GB"

if [ "${TOTAL_RAM_GB}" -ge 24 ]; then
    info "RAM >= 24 GB — pulling llama3.2-vision:11b (vision model)..."
    ollama pull llama3.2-vision:11b
else
    warning "RAM < 24 GB — skipping llama3.2-vision:11b (requires ~16 GB VRAM + overhead)."
    warning "You can pull it manually later: ollama pull llama3.2-vision:11b"
fi

# ─── Done ────────────────────────────────────────────────────────────────────
info ""
info "✅ Ollama setup complete!"
info "   Host binding : http://127.0.0.1:11434"
info "   Models pulled: qwen2.5:7b, nomic-embed-text"
info ""
info "Test with:"
info "  curl http://127.0.0.1:11434/api/generate -d '{\"model\":\"qwen2.5:7b\",\"prompt\":\"Hello!\",\"stream\":false}'"
