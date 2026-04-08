#!/bin/bash

# Qooz Installer Script
# Usage: ./install.sh [command]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}
╔═══════════════════════════════════════╗
║           QOOZ INSTALLER               ║
║     Quiz App Powered by Qooz           ║
╚═══════════════════════════════════════╝
${NC}"

# Get script directory and change to project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Get IP address
get_ip() {
    ip addr show 2>/dev/null | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | cut -d'/' -f1 | head -1
}

IP=$(get_ip)

# Check if podman/docker is available
check_podman() {
    if command -v podman &> /dev/null; then
        echo "podman"
    elif command -v docker &> /dev/null; then
        echo "docker"
    else
        echo ""
    fi
}

CONTAINER_CMD=$(check_podman)

# Install dependencies
install_deps() {
    echo -e "\n${YELLOW}[1/3] Installing npm dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ npm dependencies installed${NC}"
}

# Start API and Database
start_api() {
    echo -e "\n${YELLOW}[2/3] Starting API and Database...${NC}"
    
    if [ -z "$CONTAINER_CMD" ]; then
        echo -e "${RED}✗ Error: Neither podman nor docker is installed${NC}"
        echo "Please install podman: sudo pacman -S podman"
        exit 1
    fi
    
    # Stop existing containers
    $CONTAINER_CMD compose down 2>/dev/null || true
    
    # Start only API and DB (not web, we run web on host for hot reload)
    $CONTAINER_CMD compose up -d qooz-db qooz-api qooz-pma
    
    echo -e "${GREEN}✓ API and Database started${NC}"
    echo -e "${BLUE}  - API: http://localhost:8080/qooz/api${NC}"
    echo -e "${BLUE}  - phpMyAdmin: http://localhost:8081${NC}"
}

# Clean up old processes
cleanup() {
    echo -e "\n${YELLOW}Cleaning up old processes...${NC}"
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "node.*next" 2>/dev/null || true
    rm -rf .next/dev/lock 2>/dev/null || true
    echo -e "${GREEN}✓ Cleanup done${NC}"
}

# Check if port is in use
check_port() {
    if ss -tuln 2>/dev/null | grep -q ":3000 " || netstat -tuln 2>/dev/null | grep -q ":3000 "; then
        echo -e "${YELLOW}⚠ Port 3000 is in use. Cleaning up...${NC}"
        cleanup
    fi
}

# Start development server
start_dev() {
    echo -e "\n${YELLOW}[3/3] Starting development server...${NC}"
    
    # Clean up old processes first
    cleanup
    
    # Update env with correct IP
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$IP:8080/qooz/api|" .env.local
    
    echo -e "${GREEN}✓ Development server starting...${NC}"
    echo -e "\n${BLUE}═══════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ACCESS URLs:${NC}"
    echo -e "${BLUE}  - Local:   http://localhost:3000${NC}"
    echo -e "${BLUE}  - Network: http://$IP:3000${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Open http://$IP:3000 on your phone!${NC}\n"
    
    # Run dev server
    npm run dev -- --hostname 0.0.0.0
}

# Stop all services
stop() {
    echo -e "\n${YELLOW}Stopping Qooz services...${NC}"
    if [ -n "$CONTAINER_CMD" ]; then
        $CONTAINER_CMD compose down 2>/dev/null || true
    fi
    pkill -f "next dev" 2>/dev/null || true
    echo -e "${GREEN}✓ All services stopped${NC}"
}

# Show status
status() {
    echo -e "\n${BLUE}Qooz Status:${NC}"
    if [ -n "$CONTAINER_CMD" ]; then
        echo -e "\nContainers:"
        $CONTAINER_CMD ps -a --filter "name=qooz" --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo "No qooz containers"
    fi
    echo -e "\nAccess URLs:"
    echo -e "  - Web:       http://$IP:3000"
    echo -e "  - API:       http://$IP:8080/qooz/api"
    echo -e "  - phpMyAdmin: http://$IP:8081"
}

# Main menu
case "${1:-start}" in
    start|dev)
        install_deps
        start_api
        start_dev
        ;;
    install)
        install_deps
        start_api
        echo -e "\n${GREEN}✓ Installation complete! Run './install.sh start' to begin${NC}"
        ;;
    api)
        install_deps
        start_api
        ;;
    web)
        start_dev
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    *)
        echo -e "${YELLOW}Usage: $0 [command]${NC}"
        echo ""
        echo "Commands:"
        echo "  start    - Start everything (default)"
        echo "  install  - Install dependencies only"
        echo "  api      - Start API & DB only"
        echo "  web      - Start web server only"
        echo "  stop     - Stop all services"
        echo "  status   - Show service status"
        echo ""
        echo "Examples:"
        echo "  ./install.sh start    # Start everything"
        echo "  ./install.sh api      # Start API & DB"
        ;;
esac
