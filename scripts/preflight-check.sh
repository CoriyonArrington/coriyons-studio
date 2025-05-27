#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Helper function for logging ---
log_step() {
  echo ""
  echo "🚀 Step: $1"
  echo "--------------------------------------------------"
}

log_success() {
  echo "✅ $1"
}

log_warning() {
  echo "⚠️ $1"
}

log_info() {
  echo "ℹ️ $1"
}

# --- Start Pre-flight Checks ---
echo "🏁 Starting Pre-flight Checks..."

# 1. Generate Supabase Types & Check Schema Drift
log_step "Supabase Schema & Types"
echo "   Ensuring Supabase types are up-to-date..."
bash scripts/generate-supabase-types.sh
log_success "Supabase types generated."

echo "   Checking for schema drift..."
bash scripts/check-schema-drift.sh
log_success "Schema drift check passed (no drift detected)."

# 2. Linting
log_step "Linting & Formatting"
# Assumption: You have an npm script "lint" configured (e.g., "eslint .")
# Or "format:check" for prettier
if [ -f package.json ] && grep -q "\"lint\"" package.json; then
  echo "   Running 'npm run lint'..."
  npm run lint
  log_success "Linting passed."
else
  log_warning "'npm run lint' script not found in package.json. Skipping linting. Consider adding it."
  # You could add direct calls here if you know the tools, e.g.:
  # if command -v eslint &> /dev/null; then eslint .; else log_warning "ESLint not found."; fi
fi

# 3. Run Tests (Unit & Integration)
log_step "Running Tests"
# Assumption: Your 'npm run test' script calls 'vitest run' for a single pass.
# If 'npm run test' uses 'vitest' (watch mode), this will hang.
# It's better to have a dedicated script like 'npm run test:ci' or call 'vitest run' directly.
if [ -f package.json ] && grep -q "\"test\"" package.json; then
  echo "   Running 'npm run test' (ensure this uses 'vitest run' or similar for non-watch mode)..."
  # IMPORTANT: Ensure your "test" script in package.json is configured for a single run, e.g., "vitest run"
  # If it's just "vitest", it will hang in watch mode.
  # Alternatively, call vitest directly if available:
  if command -v vitest &> /dev/null; then
    vitest run
  else
    npm run test # Fallback, hoping it's configured correctly
  fi
  log_success "All tests passed."
else
  log_warning "'npm run test' script not found in package.json. Skipping tests. Consider adding it."
fi

# 4. Production Build (Example for Next.js, adapt if different)
log_step "Production Build Check"
if [ -f package.json ] && grep -q "\"build\"" package.json; then
  echo "   Attempting production build using 'npm run build'..."
  npm run build
  log_success "Production build successful."
else
  log_info "No 'npm run build' script found. Skipping production build check."
fi

# 5. Generate Documentation (Example using TypeDoc, adapt if different)
log_step "Documentation Generation"
# Assumption: You have an npm script "docs:generate" or use a tool like TypeDoc
if [ -f package.json ] && grep -q "\"docs:generate\"" package.json; then
  echo "   Generating documentation using 'npm run docs:generate'..."
  npm run docs:generate
  log_success "Documentation generated."
elif command -v typedoc &> /dev/null && [ -d "src" ]; then # Check if typedoc is globally available and src dir exists
  echo "   Attempting to generate documentation with TypeDoc..."
  # Adjust TypeDoc options as needed: --out <outputDir> <entryPoints>
  typedoc --out docs src || log_warning "TypeDoc generation failed or completed with warnings."
  log_success "Documentation generation attempted."
else
  log_info "No documentation generation script (e.g., 'npm run docs:generate' or TypeDoc) found/configured. Skipping."
fi

echo ""
echo "🎉🎉🎉 All Pre-flight Checks Passed Successfully! Ready for PR/Deployment. 🎉🎉🎉"