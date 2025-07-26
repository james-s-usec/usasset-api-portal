#!/usr/bin/env bash

# Portal Status Script
# Provides a comprehensive overview of the React/TypeScript portal project

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default values
SHOW_HELP=false
VERBOSE=false
LOG_DIR="logs"
OUTPUT_FILE="status.md"
CONSOLE_ONLY=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            SHOW_HELP=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --log-dir)
            LOG_DIR="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --console)
            CONSOLE_ONLY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            SHOW_HELP=true
            shift
            ;;
    esac
done

# Show help if requested
if [ "$SHOW_HELP" = true ]; then
    cat << EOF
Portal Status Script

Shows a comprehensive overview of the React portal project including lint results,
tests, build status, and bundle analysis.

Usage: $0 [OPTIONS]

OPTIONS:
    -h, --help       Show this help message
    -v, --verbose    Show detailed log contents
    --log-dir DIR    Specify logs directory (default: logs)
    -o, --output FILE Output to file (default: status.md)
    --console        Output to console only (no file)

EXAMPLES:
    $0                      # Generate status.md file with overview
    $0 --console            # Show status on console only
    $0 -v -o detailed.md    # Detailed status to custom file

EOF
    exit 0
fi

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Output function - writes to both file and console or just console
output() {
    local message="$1"
    local plain_message="$2"  # Message without color codes for file output
    
    if [ "$CONSOLE_ONLY" = true ]; then
        echo -e "$message"
    else
        # Output to console with colors
        echo -e "$message"
        # Output to file without colors
        echo -e "${plain_message:-$(echo "$message" | sed 's/\x1b\[[0-9;]*m//g')}" >> "$OUTPUT_FILE"
    fi
}

# Initialize status file
if [ "$CONSOLE_ONLY" = false ]; then
    cat > "$OUTPUT_FILE" << EOF
# Portal Status Report
Generated: $(date)
Working Directory: $(pwd)

EOF
fi

output "${BOLD}${BLUE}🌐 Portal Status Overview${NC}" "# 🌐 Portal Status Overview"
output "${BLUE}=================================${NC}" "=================================="
output ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    output "${RED}❌ Not a valid project directory (package.json not found)${NC}" "❌ Not a valid project directory (package.json not found)"
    exit 1
fi

# Function to run and capture command output
run_command() {
    local cmd="$1"
    local log_file="$2"
    local description="$3"
    
    output "${CYAN}⏳ Running: ${description}...${NC}" "⏳ Running: ${description}..."
    
    if $cmd > "$LOG_DIR/$log_file" 2>&1; then
        output "${GREEN}✅ ${description} completed${NC}" "✅ ${description} completed"
    else
        output "${RED}❌ ${description} failed${NC}" "❌ ${description} failed"
    fi
}

# Function to show file status
show_file_status() {
    local file="$1"
    local description="$2"
    local icon="$3"
    
    if [ -f "$LOG_DIR/$file" ]; then
        local size=$(stat -f%z "$LOG_DIR/$file" 2>/dev/null || stat -c%s "$LOG_DIR/$file" 2>/dev/null || echo "0")
        local modified=$(stat -f%Sm "$LOG_DIR/$file" 2>/dev/null || stat -c%y "$LOG_DIR/$file" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1 || echo "unknown")
        output "${GREEN}✅ $icon $description${NC}" "✅ $icon $description"
        output "   📁 $LOG_DIR/$file (${size} bytes, modified: $modified)" "   📁 $LOG_DIR/$file (${size} bytes, modified: $modified)"
    else
        output "${YELLOW}⚠️  $icon $description${NC}" "⚠️  $icon $description"
        output "   📁 $LOG_DIR/$file ${RED}(not found - run npm run status:generate)${NC}" "   📁 $LOG_DIR/$file (not found - run npm run status:generate)"
    fi
    output ""
}

# Check Node.js and npm versions
output "${BOLD}System Information:${NC}" "## System Information"
output ""

NODE_VERSION=$(node --version 2>/dev/null || echo "Not installed")
NPM_VERSION=$(npm --version 2>/dev/null || echo "Not installed")
output "  📦 Node.js: ${NODE_VERSION}" "- Node.js: ${NODE_VERSION}"
output "  📦 npm: ${NPM_VERSION}" "- npm: ${NPM_VERSION}"
output ""

# Project dependencies status
output "${BOLD}Project Dependencies:${NC}" "## Project Dependencies"
output ""

if [ -d "node_modules" ]; then
    local modules_count=$(find node_modules -maxdepth 1 -type d | wc -l | xargs)
    output "${GREEN}  ✅ node_modules: ${modules_count} packages installed${NC}" "- ✅ node_modules: ${modules_count} packages installed"
else
    output "${RED}  ❌ node_modules: Not installed (run: npm install)${NC}" "- ❌ node_modules: Not installed (run: npm install)"
fi

# Check for outdated packages (optional - can be slow)
if command -v npm &> /dev/null; then
    output "  🔍 Checking for outdated packages..." "- Checking for outdated packages..."
    npm outdated > "$LOG_DIR/outdated.log" 2>&1 || true
    local outdated_count=$(grep -c "^[a-zA-Z]" "$LOG_DIR/outdated.log" 2>/dev/null || echo "0")
    if [ "$outdated_count" -gt 0 ]; then
        output "${YELLOW}  ⚠️  ${outdated_count} packages are outdated${NC}" "- ⚠️  ${outdated_count} packages are outdated"
    else
        output "${GREEN}  ✅ All packages up to date${NC}" "- ✅ All packages up to date"
    fi
fi
output ""

# Show log file status
output "${BOLD}Log Files Status:${NC}" "## Log Files Status"
output ""

show_file_status "lint-results.log" "ESLint Results" "🔍"
show_file_status "typecheck-results.log" "TypeScript Check Results" "📘"
show_file_status "test-results.log" "Test Results" "🧪"
show_file_status "build-results.log" "Build Results" "🏗️"

# Quick summary function
show_summary() {
    local file="$1"
    local title="$2"
    local icon="$3"
    
    if [ -f "$LOG_DIR/$file" ]; then
        output "${BOLD}$icon $title Summary:${NC}" "### $icon $title Summary"
        
        case "$file" in
            "lint-results.log")
                # Check for ESLint errors
                if grep -q "error" "$LOG_DIR/$file"; then
                    local errors=$(grep -c "error" "$LOG_DIR/$file" || echo "0")
                    local warnings=$(grep -c "warning" "$LOG_DIR/$file" || echo "0")
                    output "${RED}  ❌ ${errors} errors found${NC}" "- ❌ ${errors} errors found"
                    output "${YELLOW}  ⚠️  ${warnings} warnings found${NC}" "- ⚠️  ${warnings} warnings found"
                    if [ "$VERBOSE" = true ]; then
                        output "${CYAN}  📄 First few errors:${NC}" "  First few errors:"
                        grep -m 5 "error" "$LOG_DIR/$file" || true
                    fi
                elif grep -q "warning" "$LOG_DIR/$file"; then
                    local warnings=$(grep -c "warning" "$LOG_DIR/$file" || echo "0")
                    output "${YELLOW}  ⚠️  ${warnings} warnings found${NC}" "- ⚠️  ${warnings} warnings found"
                else
                    output "${GREEN}  ✅ No issues found${NC}" "- ✅ No issues found"
                fi
                ;;
            "typecheck-results.log")
                if grep -q "error TS" "$LOG_DIR/$file"; then
                    local errors=$(grep -c "error TS" "$LOG_DIR/$file" || echo "0")
                    output "${RED}  ❌ ${errors} TypeScript errors found${NC}" "- ❌ ${errors} TypeScript errors found"
                    if [ "$VERBOSE" = true ]; then
                        output "${CYAN}  📄 First few errors:${NC}" "  First few errors:"
                        grep -m 5 "error TS" "$LOG_DIR/$file" || true
                    fi
                elif grep -q "Found 0 errors" "$LOG_DIR/$file"; then
                    output "${GREEN}  ✅ No TypeScript errors${NC}" "- ✅ No TypeScript errors"
                else
                    output "${YELLOW}  ⚠️  TypeScript check status unclear${NC}" "- ⚠️  TypeScript check status unclear"
                fi
                ;;
            "test-results.log")
                if grep -q "PASS" "$LOG_DIR/$file"; then
                    local passed=$(grep -c "PASS" "$LOG_DIR/$file" || echo "0")
                    local failed=$(grep -c "FAIL" "$LOG_DIR/$file" || echo "0")
                    
                    output "${GREEN}  ✅ Passed: ${passed} test suites${NC}" "- ✅ Passed: ${passed} test suites"
                    if [ "$failed" -gt 0 ]; then
                        output "${RED}  ❌ Failed: ${failed} test suites${NC}" "- ❌ Failed: ${failed} test suites"
                    fi
                    
                    # Extract test summary if available
                    if grep -q "Tests:" "$LOG_DIR/$file"; then
                        local test_summary=$(grep "Tests:" "$LOG_DIR/$file" | tail -1)
                        output "  📊 ${test_summary}" "- 📊 ${test_summary}"
                    fi
                else
                    output "${YELLOW}  ⚠️  No test results found${NC}" "- ⚠️  No test results found"
                fi
                ;;
            "build-results.log")
                if grep -q "Build failed" "$LOG_DIR/$file" || grep -q "error" "$LOG_DIR/$file"; then
                    output "${RED}  ❌ Build failed${NC}" "- ❌ Build failed"
                    if [ "$VERBOSE" = true ]; then
                        output "${CYAN}  📄 Build errors:${NC}" "  Build errors:"
                        grep -A 5 -B 5 "error" "$LOG_DIR/$file" | head -20 || true
                    fi
                elif grep -q "built in" "$LOG_DIR/$file" || grep -q "Build complete" "$LOG_DIR/$file"; then
                    output "${GREEN}  ✅ Build successful${NC}" "- ✅ Build successful"
                    
                    # Extract build time if available
                    if grep -q "built in" "$LOG_DIR/$file"; then
                        local build_time=$(grep "built in" "$LOG_DIR/$file" | tail -1)
                        output "  ⏱️  ${build_time}" "- ⏱️  ${build_time}"
                    fi
                    
                    # Show bundle size if available
                    if grep -q "dist/" "$LOG_DIR/$file"; then
                        output "  📦 Bundle sizes:" "- 📦 Bundle sizes:"
                        grep "dist/" "$LOG_DIR/$file" | head -5 || true
                    fi
                else
                    output "${YELLOW}  ⚠️  Build status unclear${NC}" "- ⚠️  Build status unclear"
                fi
                ;;
        esac
        output ""
    fi
}

# Show summaries
output "${BOLD}Quick Summary:${NC}" "## Quick Summary"
output ""

show_summary "lint-results.log" "Code Quality" "🔍"
show_summary "typecheck-results.log" "TypeScript" "📘"
show_summary "test-results.log" "Tests" "🧪"
show_summary "build-results.log" "Build" "🏗️"

# Check build output
output "${BOLD}Build Output:${NC}" "## Build Output"
output ""

if [ -d "dist" ]; then
    local dist_files=$(find dist -name "*.js" -o -name "*.css" 2>/dev/null | wc -l | xargs)
    local dist_size=$(du -sh dist 2>/dev/null | cut -f1)
    output "${GREEN}  ✅ dist/: ${dist_files} files (${dist_size})${NC}" "- ✅ dist/: ${dist_files} files (${dist_size})"
    
    # Show largest files
    if [ "$VERBOSE" = true ]; then
        output "  📊 Largest files:" "  Largest files:"
        find dist -name "*.js" -o -name "*.css" | xargs ls -lh 2>/dev/null | sort -k5 -hr | head -5 | awk '{print "    " $9 " (" $5 ")"}' || true
    fi
else
    output "${YELLOW}  ⚠️  dist/: Not found (run: npm run build)${NC}" "- ⚠️  dist/: Not found (run: npm run build)"
fi
output ""

# Environment configuration
output "${BOLD}Environment Configuration:${NC}" "## Environment Configuration"
output ""

if [ -f ".env" ]; then
    output "${GREEN}  ✅ .env file exists${NC}" "- ✅ .env file exists"
    # Count non-comment, non-empty lines
    local env_vars=$(grep -v "^#" .env | grep -v "^$" | wc -l | xargs)
    output "  📝 ${env_vars} environment variables configured" "- 📝 ${env_vars} environment variables configured"
else
    output "${YELLOW}  ⚠️  .env file not found${NC}" "- ⚠️  .env file not found"
fi

if [ -f ".env.example" ]; then
    output "${GREEN}  ✅ .env.example file exists${NC}" "- ✅ .env.example file exists"
else
    output "${YELLOW}  ⚠️  .env.example file not found${NC}" "- ⚠️  .env.example file not found"
fi
output ""

# Show recommendations
output "${BOLD}💡 Next Steps:${NC}" "## 💡 Next Steps"
output ""

# Check if logs exist
if [ ! -f "$LOG_DIR/lint-results.log" ] || [ ! -f "$LOG_DIR/test-results.log" ]; then
    output "${BLUE}  🚀 Generate all status logs: npm run status:generate${NC}" "- 🚀 Generate all status logs: \`npm run status:generate\`"
fi

if [ -f "$LOG_DIR/lint-results.log" ] && grep -q "error" "$LOG_DIR/lint-results.log"; then
    output "${YELLOW}  🔧 Fix ESLint errors: npm run lint:fix${NC}" "- 🔧 Fix ESLint errors: \`npm run lint:fix\`"
fi

if [ -f "$LOG_DIR/typecheck-results.log" ] && grep -q "error TS" "$LOG_DIR/typecheck-results.log"; then
    output "${YELLOW}  📘 Fix TypeScript errors: Review errors and update types${NC}" "- 📘 Fix TypeScript errors: Review errors and update types"
fi

if [ ! -d "dist" ]; then
    output "${BLUE}  🏗️  Build the project: npm run build${NC}" "- 🏗️  Build the project: \`npm run build\`"
fi

output "${BLUE}  📊 View this status again: npm run status${NC}" "- 📊 View this status again: \`npm run status\`"
output ""

# Add common commands section
output "${BOLD}📋 Common Commands:${NC}" "## 📋 Common Commands"
output ""

output "${CYAN}**Development:**${NC}" "### Development"
output "${BLUE}  • npm run dev           ${NC}# Start development server with hot reload" "- \`npm run dev\` - Start development server with hot reload"
output "${BLUE}  • npm run build         ${NC}# Build for production" "- \`npm run build\` - Build for production"
output "${BLUE}  • npm run preview       ${NC}# Preview production build locally" "- \`npm run preview\` - Preview production build locally"
output ""

output "${CYAN}**Code Quality:**${NC}" "### Code Quality"
output "${BLUE}  • npm run lint          ${NC}# Run ESLint" "- \`npm run lint\` - Run ESLint"
output "${BLUE}  • npm run lint:fix      ${NC}# Auto-fix ESLint issues" "- \`npm run lint:fix\` - Auto-fix ESLint issues"
output "${BLUE}  • npm run typecheck     ${NC}# Run TypeScript type checking" "- \`npm run typecheck\` - Run TypeScript type checking"
output "${BLUE}  • npm run format        ${NC}# Format code with Prettier (if configured)" "- \`npm run format\` - Format code with Prettier (if configured)"
output ""

output "${CYAN}**Testing:**${NC}" "### Testing"
output "${BLUE}  • npm test              ${NC}# Run tests" "- \`npm test\` - Run tests"
output "${BLUE}  • npm run test:watch    ${NC}# Run tests in watch mode" "- \`npm run test:watch\` - Run tests in watch mode"
output "${BLUE}  • npm run test:coverage ${NC}# Run tests with coverage" "- \`npm run test:coverage\` - Run tests with coverage"
output ""

output "${CYAN}**Status & Analysis:**${NC}" "### Status & Analysis"
output "${BLUE}  • npm run status        ${NC}# Show this status overview" "- \`npm run status\` - Show this status overview"
output "${BLUE}  • npm run status:generate ${NC}# Generate all status logs" "- \`npm run status:generate\` - Generate all status logs"
output "${BLUE}  • npm run analyze       ${NC}# Analyze bundle size (if configured)" "- \`npm run analyze\` - Analyze bundle size (if configured)"
output ""

# Authentication status check
output "${BOLD}🔐 Authentication Configuration:${NC}" "## 🔐 Authentication Configuration"
output ""

# Check for auth-related environment variables
if [ -f ".env" ]; then
    if grep -q "VITE_API_URL" .env; then
        output "${GREEN}  ✅ API URL configured${NC}" "- ✅ API URL configured"
    else
        output "${YELLOW}  ⚠️  VITE_API_URL not found in .env${NC}" "- ⚠️  VITE_API_URL not found in .env"
    fi
    
    if grep -q "VITE_AZURE_AD" .env; then
        output "${GREEN}  ✅ Azure AD configuration found${NC}" "- ✅ Azure AD configuration found"
    else
        output "${YELLOW}  ⚠️  Azure AD configuration not found${NC}" "- ⚠️  Azure AD configuration not found"
    fi
fi
output ""

output "${BOLD}${GREEN}✨ Status check complete!${NC}" "## ✨ Status Check Complete!"

# Final message about output file
if [ "$CONSOLE_ONLY" = false ]; then
    echo ""
    echo -e "${GREEN}📄 Status report saved to: ${OUTPUT_FILE}${NC}"
    echo -e "${BLUE}📊 View status again: npm run status${NC}"
fi