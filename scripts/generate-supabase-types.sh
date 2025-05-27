#!/usr/bin/env bash
# File: scripts/generate-supabase-types.sh
# Generates TypeScript types from the linked Supabase project schema with retries and robust file handling.

set -euo pipefail # Exit on error, undefined variable, or pipe failure

# --- Project Reference ID ---
SUPABASE_PROJECT_REF="lqwajjazuknoyykqznmr"

# --- Configuration ---
OUTPUT_FILE_PATH="types/supabase.ts"
MAX_RETRIES=3
RETRY_DELAY_SECONDS=2 # Seconds to wait between retries

# --- Script Start ---
echo "🛠️  Generating Supabase types from REMOTE project $SUPABASE_PROJECT_REF into $OUTPUT_FILE_PATH..."

OUTPUT_DIR=$(dirname "$OUTPUT_FILE_PATH")
mkdir -p "$OUTPUT_DIR" # Ensure the output directory exists

RETRY_COUNT=0
GENERATION_SUCCESSFUL=false

# Ensure the target types/supabase.ts file path is at least touched initially.
# This helps if tests try to readFileSync it before it's fully populated should generation fail early.
# The main generation logic will forcefully replace it if successful.
touch "$OUTPUT_FILE_PATH"

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$GENERATION_SUCCESSFUL" = "false" ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -gt 1 ]; then
    echo "   Retrying type generation (attempt $RETRY_COUNT of $MAX_RETRIES) for $OUTPUT_FILE_PATH after $RETRY_DELAY_SECONDS second(s)..." >&2
    sleep $RETRY_DELAY_SECONDS
  fi

  # Generate into a new temporary file first
  CURRENT_ATTEMPT_TYPES_FILE="$(mktemp)"
  # Capture stderr from the Supabase CLI command to a separate temporary file
  GENERATION_CLI_STDERR_CAPTURE_FILE="$(mktemp)"
  CLI_EXIT_CODE=0 # Assume success unless command fails

  # Ensure these specific temp files are cleaned up at the end of this iteration
  _cleanup_iteration_temps() {
    rm -f "$CURRENT_ATTEMPT_TYPES_FILE"
    rm -f "$GENERATION_CLI_STDERR_CAPTURE_FILE"
  }
  # Set trap for current subshell environment if any command fails due to set -e, or on EXIT/INT/TERM
  # This ensures temp files for this specific attempt are cleaned if script exits unexpectedly here.
  trap _cleanup_iteration_temps EXIT

  # Attempt to generate types into the temporary file
  if ! (supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > "$CURRENT_ATTEMPT_TYPES_FILE" 2> "$GENERATION_CLI_STDERR_CAPTURE_FILE"); then
    CLI_EXIT_CODE=$? # Capture non-zero exit code from supabase command
  fi

  # Check results of the generation attempt
  if [ "$CLI_EXIT_CODE" -eq 0 ]; then
    # Supabase CLI command exited 0, check if the *temporary* output file has content
    if [ -s "$CURRENT_ATTEMPT_TYPES_FILE" ]; then
      # Temp file has content, now try to replace the final destination file
      rm -f "$OUTPUT_FILE_PATH" # Ensure destination is clear for mv
      if mv "$CURRENT_ATTEMPT_TYPES_FILE" "$OUTPUT_FILE_PATH"; then
        # Only mention attempt count if it took more than one try for conciseness
        if [ $RETRY_COUNT -gt 1 ]; then
            echo "✅ Types saved to $OUTPUT_FILE_PATH (on attempt $RETRY_COUNT)."
        else
            echo "✅ Types saved to $OUTPUT_FILE_PATH."
        fi
        GENERATION_SUCCESSFUL=true
        # Attempt to flush filesystem buffers to disk silently
        if command -v sync &> /dev/null; then
          sync
          sleep 0.2 # Brief pause after sync
        else
          sleep 0.2 # Still add a small pause if sync not available
        fi
      else
        echo "⚠️ Supabase CLI produced types, but failed to move temporary types to $OUTPUT_FILE_PATH (attempt $RETRY_COUNT). Check permissions." >&2
      fi
    else
      # Supabase CLI command exited 0 but produced an empty temporary file
      echo "⚠️ Supabase CLI command 'gen types' succeeded (attempt $RETRY_COUNT, exit code 0) but temporary output file was empty." >&2
      if [ -s "$GENERATION_CLI_STDERR_CAPTURE_FILE" ]; then
        echo "   Supabase CLI stderr during this attempt (exit 0, empty temp output):" >&2
        cat "$GENERATION_CLI_STDERR_CAPTURE_FILE" >&2
      else
        echo "   Supabase CLI stderr was empty during this attempt (exit 0, empty temp output)." >&2
      fi
    fi
  else
    # Supabase CLI command failed (exited non-zero)
    echo "⚠️ Supabase CLI command 'gen types' failed (attempt $RETRY_COUNT) with exit code $CLI_EXIT_CODE." >&2
    if [ -s "$GENERATION_CLI_STDERR_CAPTURE_FILE" ]; then
        echo "   Supabase CLI stderr during this failed attempt (exit $CLI_EXIT_CODE):" >&2
        cat "$GENERATION_CLI_STDERR_CAPTURE_FILE" >&2
    else
        echo "   Supabase CLI stderr was empty during this failed attempt (exit $CLI_EXIT_CODE)." >&2
    fi
  fi
  
  _cleanup_iteration_temps # Clean up iteration's temp files
  trap - EXIT # Clear the trap for this iteration before next loop or successful script exit
done

# After all retries, check final status
if [ "$GENERATION_SUCCESSFUL" = "false" ]; then
  echo "🚨 CRITICAL: Failed to generate non-empty Supabase types into '$OUTPUT_FILE_PATH' for project $SUPABASE_PROJECT_REF after $MAX_RETRIES attempts." >&2
  exit 1
fi

# Final confirmation message from this script.
echo "✅ Supabase types generation complete for project $SUPABASE_PROJECT_REF, saved to $OUTPUT_FILE_PATH."