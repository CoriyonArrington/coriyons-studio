#!/usr/bin/env bash
# File: scripts/update-supabase-types.sh
# Purpose: Generates and overwrites local Supabase types from the remote schema.

set -euo pipefail

SUPABASE_PROJECT_REF="lqwajjazuknoyykqznmr" # Ensure this is your correct project ref
OUTPUT_FILE_PATH="src/types/supabase.ts" # MODIFIED PATH
MAX_RETRIES=5 # Increased for more resilience
RETRY_DELAY_SECONDS=5 # Increased delay

echo "🔄 Attempting to update Supabase types from REMOTE project $SUPABASE_PROJECT_REF into $OUTPUT_FILE_PATH..."

OUTPUT_DIR=$(dirname "$OUTPUT_FILE_PATH")
mkdir -p "$OUTPUT_DIR"

RETRY_COUNT=0
GENERATION_SUCCESSFUL=false

# Ensure the target file path can be written to by touching it.
# The main logic will forcefully replace it.
touch "$OUTPUT_FILE_PATH" 

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$GENERATION_SUCCESSFUL" = "false" ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -gt 1 ]; then
    echo "   Retrying type generation (attempt $RETRY_COUNT of $MAX_RETRIES) for $OUTPUT_FILE_PATH after $RETRY_DELAY_SECONDS second(s)..." >&2
    sleep $RETRY_DELAY_SECONDS
  fi

  CURRENT_ATTEMPT_TYPES_FILE="$(mktemp)"
  CLI_STDERR_FILE="$(mktemp)"

  _cleanup_temps() {
    rm -f "$CURRENT_ATTEMPT_TYPES_FILE" "$CLI_STDERR_FILE"
  }
  # Trap EXIT for the current script execution to ensure cleanup
  # If this script is sourced, this trap might affect the parent. For direct execution, it's fine.
  trap _cleanup_temps EXIT 

  CLI_EXIT_CODE=0
  # Attempt to generate types into the temporary file
  # We are NOT silencing supabase gen types stderr here to capture it.
  if ! (supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > "$CURRENT_ATTEMPT_TYPES_FILE" 2> "$CLI_STDERR_FILE"); then
    CLI_EXIT_CODE=$?
  fi

  if [ "$CLI_EXIT_CODE" -eq 0 ]; then
    # Supabase CLI command exited 0, check if the *temporary* output file has content
    if [ -s "$CURRENT_ATTEMPT_TYPES_FILE" ]; then
      # Temp file has content, now replace the final destination file
      rm -f "$OUTPUT_FILE_PATH" # Ensure destination is clear for mv
      if mv "$CURRENT_ATTEMPT_TYPES_FILE" "$OUTPUT_FILE_PATH"; then
        if [ $RETRY_COUNT -gt 1 ]; then
            echo "✅ Types successfully updated and saved to $OUTPUT_FILE_PATH (on attempt $RETRY_COUNT)."
        else
            echo "✅ Types successfully updated and saved to $OUTPUT_FILE_PATH."
        fi
        GENERATION_SUCCESSFUL=true
        # Attempt to flush filesystem buffers to disk silently
        if command -v sync &> /dev/null; then sync; sleep 0.2; else sleep 0.2; fi
      else
        echo "⚠️ CLI generated types, but failed to move temporary types to $OUTPUT_FILE_PATH (attempt $RETRY_COUNT). Check permissions." >&2
      fi
    else 
      echo "⚠️ Supabase CLI 'gen types' succeeded (attempt $RETRY_COUNT, exit 0) but temporary output file was empty." >&2
      if [ -s "$CLI_STDERR_FILE" ]; then echo "   Supabase CLI stderr:" >&2; cat "$CLI_STDERR_FILE" >&2; else echo "   Supabase CLI stderr was empty." >&2; fi
    fi
  else 
    echo "⚠️ Supabase CLI 'gen types' failed (attempt $RETRY_COUNT) with exit code $CLI_EXIT_CODE." >&2
    if [ -s "$CLI_STDERR_FILE" ]; then echo "   Supabase CLI stderr:" >&2; cat "$CLI_STDERR_FILE" >&2; else echo "   Supabase CLI stderr was empty." >&2; fi
  fi
  
  # Explicitly call cleanup for this iteration's files; trap handles script exit.
  # If GENERATION_SUCCESSFUL is true, CURRENT_ATTEMPT_TYPES_FILE was moved, so rm -f on it will do nothing.
  rm -f "$CURRENT_ATTEMPT_TYPES_FILE" 
  rm -f "$CLI_STDERR_FILE"
  # Important: Clear the trap if the loop is to continue and reset temp file names,
  # or ensure trap only cleans up $CURRENT_ATTEMPT_TYPES_FILE and $CLI_STDERR_FILE.
  # For simplicity, let the main script EXIT trap handle final cleanup if loop breaks early.
  # However, if script continues, these specific iteration temps are gone.
  # To be absolutely safe with `mktemp` in a loop and `set -e`, it's often better to clean just before `mktemp` or after use.
  # The current explicit `rm -f` is good.
done

# Clear the general EXIT trap now that we are done with loop-specific temp files
trap - EXIT

if [ "$GENERATION_SUCCESSFUL" = "false" ]; then
  echo "🚨 CRITICAL: Failed to generate and save Supabase types to '$OUTPUT_FILE_PATH' after $MAX_RETRIES attempts." >&2
  exit 1
fi

echo "✅ Supabase types update process complete for $OUTPUT_FILE_PATH."