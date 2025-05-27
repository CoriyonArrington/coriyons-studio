#!/usr/bin/env bash
# File: scripts/preflight-check.sh

set -e # Exit immediately if a command exits with a non-zero status.

# --- Helper function for logging ---
log_step() {
  echo ""
  echo "🚀 Step: $1"
  echo "--------------------------------------------------"
}
log_success() { echo "✅ $1"; }
log_warning() { echo "⚠️ $1"; } # Not used if set -e is active for warnings that mean failure
log_info() { echo "ℹ️ $1"; }

# --- Start Pre-flight Checks ---
echo "🏁 Starting Pre-flight Checks..."

# 1. Verify Supabase Schema Types
log_step "Supabase Schema Type Verification"
if bash scripts/verify-schema-types.sh; then
  log_success "Local Supabase types are IN SYNC with the remote schema."
else
  # verify-schema-types.sh exits 1 on drift and prints instructions.
  # set -e will cause this preflight script to exit here if verify-schema-types.sh failed.
  echo "   👆 Schema drift detected or verification failed. Pre-flight check cannot continue." >&2
  exit 1 
fi

# 2. Generate Directory Structure (if this script exists and is needed)
log_step "Directory Structure Setup"
if [ -f scripts/generate-directory-structure.sh ]; then
  echo "   Running directory structure generation..."
  bash scripts/generate-directory-structure.sh
  log_success "Directory structure script completed."
else
  log_info "scripts/generate-directory-structure.sh not found. Skipping."
fi


# 3. Linting
log_step "Linting & Formatting"
if [ -f package.json ] && grep -q "\"lint\"" package.json; then
  echo "   Running 'npm run lint'..."
  npm run lint
  log_success "Linting passed."
else
  log_warning "'npm run lint' script not found in package.json. Skipping."
fi

# 4. Run Tests (Unit & Integration)
log_step "Running Tests"
if [ -f package.json ] && grep -q "\"test\"" package.json; then
  echo "   Running 'npm run test' (ensure this uses 'vitest run')..."
  npm run test # Make sure your package.json "test" script is "vitest run"
  log_success "All tests passed."
else
  log_warning "'npm run test' script not found. Skipping tests."
fi

# 5. Production Build Check (Example for Next.js)
log_step "Production Build Check"
if [ -f package.json ] && grep -q "\"build\"" package.json; then
  echo "   Attempting production build using 'npm run build'..."
  npm run build
  log_success "Production build successful."
else
  log_info "No 'npm run build' script found. Skipping."
fi

# 6. Generate Documentation (Example)
log_step "Documentation Generation"
if [ -f package.json ] && grep -q "\"docs:generate\"" package.json; then
  echo "   Generating documentation using 'npm run docs:generate'..."
  npm run docs:generate
  log_success "Documentation generated."
else
  log_info "No documentation generation script found. Skipping."
fi

echo ""
echo "🎉🎉🎉 All Pre-flight Checks Passed Successfully! Ready for PR/Deployment. 🎉🎉🎉"