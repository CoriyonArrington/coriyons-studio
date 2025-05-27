#!/usr/bin/env bash
# File: scripts/generate-supabase-types.sh
# Generates TypeScript types from the linked Supabase project schema with retries and robust file handling.

set -euo pipefail # Exit on error, undefined variable, or pipe failure

# --- Project Reference ID ---
SUPABASE_PROJECT_REF="lqwajjazuknoyykqznmr"

# --- Configuration ---
OUTPUT_FILE_PATH="types/supabase.ts"
MAX_RETRIES=5 # Kept increased retries
RETRY_DELAY_SECONDS=5 # Kept increased delay

# --- Script Start ---
echo "🛠️  Generating Supabase types from REMOTE project $SUPABASE_PROJECT_REF into $OUTPUT_FILE_PATH..."

OUTPUT_DIR=$(dirname "$OUTPUT_FILE_PATH")
mkdir -p "$OUTPUT_DIR" # Ensure the output directory exists

RETRY_COUNT=0
GENERATION_SUCCESSFUL=false

# Ensure the target types/supabase.ts file path is at least touched initially.
touch "$OUTPUT_FILE_PATH"

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$GENERATION_SUCCESSFUL" = "false" ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -gt 1 ]; then
    # Log only if retrying
    echo "   Retrying type generation (attempt $RETRY_COUNT of $MAX_RETRIES) for $OUTPUT_FILE_PATH after $RETRY_DELAY_SECONDS second(s)..." >&2
    sleep $RETRY_DELAY_SECONDS
  fi

  CURRENT_ATTEMPT_TYPES_FILE="$(mktemp)"
  GENERATION_CLI_STDERR_CAPTURE_FILE="$(mktemp)"
  CLI_EXIT_CODE=0 

  _cleanup_iteration_temps() {
    rm -f "$CURRENT_ATTEMPT_TYPES_FILE"
    rm -f "$GENERATION_CLI_STDERR_CAPTURE_FILE"
  }
  trap _cleanup_iteration_temps EXIT

  # Attempt to generate types into the temporary file
  if ! (supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > "$CURRENT_ATTEMPT_TYPES_FILE" 2> "$GENERATION_CLI_STDERR_CAPTURE_FILE"); then
    CLI_EXIT_CODE=$? 
  fi

  if [ "$CLI_EXIT_CODE" -eq 0 ]; then
    if [ -s "$CURRENT_ATTEMPT_TYPES_FILE" ]; then
      rm -f "$OUTPUT_FILE_PATH" 
      if mv "$CURRENT_ATTEMPT_TYPES_FILE" "$OUTPUT_FILE_PATH"; then
        if [ $RETRY_COUNT -gt 1 ]; then
            echo "✅ Types saved to $OUTPUT_FILE_PATH (on attempt $RETRY_COUNT)."
        else
            echo "✅ Types saved to $OUTPUT_FILE_PATH." 
        fi
        GENERATION_SUCCESSFUL=true
        if command -v sync &> /dev/null; then
          sync
          sleep 0.2 
        else
          sleep 0.2 
        fi
      else
        echo "⚠️ Supabase CLI produced types, but failed to move temporary types to $OUTPUT_FILE_PATH (attempt $RETRY_COUNT). Check permissions." >&2
      fi
    else
      echo "⚠️ Supabase CLI command 'gen types' succeeded (attempt $RETRY_COUNT, exit code 0) but temporary output file was empty." >&2
      if [ -s "$GENERATION_CLI_STDERR_CAPTURE_FILE" ]; then
        echo "   Supabase CLI stderr during this attempt (exit 0, empty temp output):" >&2
        cat "$GENERATION_CLI_STDERR_CAPTURE_FILE" >&2
      else
        echo "   Supabase CLI stderr was empty during this attempt (exit 0, empty temp output)." >&2
      fi
    fi
  else
    echo "⚠️ Supabase CLI command 'gen types' failed (attempt $RETRY_COUNT) with exit code $CLI_EXIT_CODE." >&2
    if [ -s "$GENERATION_CLI_STDERR_CAPTURE_FILE" ]; then
        echo "   Supabase CLI stderr during this failed attempt (exit $CLI_EXIT_CODE):" >&2
        cat "$GENERATION_CLI_STDERR_CAPTURE_FILE" >&2
    else
        echo "   Supabase CLI stderr was empty during this failed attempt (exit $CLI_EXIT_CODE)." >&2
    fi
  fi
  
  _cleanup_iteration_temps 
  trap - EXIT 
done

if [ "$GENERATION_SUCCESSFUL" = "false" ]; then
  echo "🚨 CRITICAL: Failed to generate non-empty Supabase types into '$OUTPUT_FILE_PATH' for project $SUPABASE_PROJECT_REF after $MAX_RETRIES attempts." >&2
  exit 1
fi

echo "✅ Supabase types generation complete for project $SUPABASE_PROJECT_REF, saved to $OUTPUT_FILE_PATH."