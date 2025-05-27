#!/usr/bin/env bash
# File: scripts/generate-supabase-types.sh
# Final review of success condition logic

set -euo pipefail

SUPABASE_PROJECT_REF="lqwajjazuknoyykqznmr"
OUTPUT_FILE_PATH="types/supabase.ts"
MAX_RETRIES=3 
RETRY_DELAY_SECONDS=2

# Diagnostics (keeping these as the issue is intermittent and contextual)
echo "--- generate-supabase-types.sh diagnostics (PID: $$) ---" >&2
echo "PATH: $PATH" >&2
echo "Which supabase: $(which supabase || echo 'supabase not in PATH')" >&2
echo "Supabase version detected by script: $(supabase --version 2>/dev/null || echo 'Error getting supabase version')" >&2
echo "--- end diagnostics ---" >&2

echo "🛠️  Generating Supabase types from REMOTE project $SUPABASE_PROJECT_REF into $OUTPUT_FILE_PATH..."
OUTPUT_DIR=$(dirname "$OUTPUT_FILE_PATH")
mkdir -p "$OUTPUT_DIR"

RETRY_COUNT=0
GENERATION_SUCCESSFUL=false

# Ensures types/supabase.ts exists if generation fails early, preventing readFileSync errors in tests.
# The main logic will forcefully replace it if generation is successful.
touch "$OUTPUT_FILE_PATH" 

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$GENERATION_SUCCESSFUL" = "false" ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -gt 1 ]; then
    echo "   Retrying type generation (attempt $RETRY_COUNT of $MAX_RETRIES) for $OUTPUT_FILE_PATH after $RETRY_DELAY_SECONDS second(s)..." >&2
    sleep $RETRY_DELAY_SECONDS
  fi

  CURRENT_ATTEMPT_TYPES_FILE="$(mktemp)"
  GENERATION_CLI_STDERR_CAPTURE_FILE="$(mktemp)"
  
  # Local trap for cleaning up files specific to this iteration
  _cleanup_iteration_temps() {
    rm -f "$CURRENT_ATTEMPT_TYPES_FILE"
    rm -f "$GENERATION_CLI_STDERR_CAPTURE_FILE"
  }
  trap _cleanup_iteration_temps RETURN # Clean up when this iteration's block exits (bash 4.4+) or use EXIT and clear

  echo "   Executing (attempt $RETRY_COUNT): supabase gen types typescript --project-id \"$SUPABASE_PROJECT_REF\" --schema public > \"$CURRENT_ATTEMPT_TYPES_FILE\"" >&2
  CLI_EXIT_CODE=0

  # Execute the command and capture its exit code
  if ! (supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > "$CURRENT_ATTEMPT_TYPES_FILE" 2> "$GENERATION_CLI_STDERR_CAPTURE_FILE"); then
    CLI_EXIT_CODE=$?
  fi

  if [ "$CLI_EXIT_CODE" -eq 0 ]; then
    # Command exited 0, check if the *temporary* output file has content
    if [ -s "$CURRENT_ATTEMPT_TYPES_FILE" ]; then
      echo "      Supabase CLI successfully generated types into temporary file (attempt $RETRY_COUNT)." >&2
      # Attempt to replace the final destination file
      if rm -f "$OUTPUT_FILE_PATH" && mv "$CURRENT_ATTEMPT_TYPES_FILE" "$OUTPUT_FILE_PATH"; then
        echo "✅ Types saved to $OUTPUT_FILE_PATH (on attempt $RETRY_COUNT)."
        GENERATION_SUCCESSFUL=true # Set success ONLY if mv is successful
        if command -v sync &> /dev/null; then
          echo "      Running 'sync' to flush filesystem buffers..." >&2
          sync
          sleep 0.2 # Brief pause after sync
        else
          echo "      'sync' command not available. Skipping explicit filesystem flush." >&2
          sleep 0.2 # Still add a small pause
        fi
      else
        echo "⚠️ Supabase CLI produced types, but failed to move temporary types to $OUTPUT_FILE_PATH (attempt $RETRY_COUNT). Check permissions or if mv failed." >&2
        # GENERATION_SUCCESSFUL remains false
      fi
    else
      echo "⚠️ Supabase CLI command 'gen types' succeeded (attempt $RETRY_COUNT, exit code 0) but temporary output file was empty." >&2
      if [ -s "$GENERATION_CLI_STDERR_CAPTURE_FILE" ]; then echo "   Supabase CLI stderr (exit 0, empty temp output):" >&2; cat "$GENERATION_CLI_STDERR_CAPTURE_FILE" >&2; else echo "   Supabase CLI stderr was empty (exit 0, empty temp output)." >&2; fi
      # GENERATION_SUCCESSFUL remains false
    fi
  else
    echo "⚠️ Supabase CLI command 'gen types' failed (attempt $RETRY_COUNT) with exit code $CLI_EXIT_CODE." >&2
    if [ -s "$GENERATION_CLI_STDERR_CAPTURE_FILE" ]; then echo "   Supabase CLI stderr (exit $CLI_EXIT_CODE):" >&2; cat "$GENERATION_CLI_STDERR_CAPTURE_FILE" >&2; else echo "   Supabase CLI stderr was empty (exit $CLI_EXIT_CODE)." >&2; fi
    # GENERATION_SUCCESSFUL remains false
  fi
  
  _cleanup_iteration_temps # Clean up this iteration's temp files
  trap - RETURN # Clear the trap for this iteration (or use EXIT and clear it once outside the loop if GENERATION_SUCCESSFUL)
done

# Clear any remaining trap that might have been set by the loop's last iteration if it exited abnormally
# A script-wide trap at the beginning for general temp files, or more careful per-iteration trap management is needed.
# For now, let's assume the per-iteration cleanup is mostly effective.
# trap - ERR EXIT INT TERM # If a global trap was set and needs clearing. The per-iteration trap should handle most.

if [ "$GENERATION_SUCCESSFUL" = "false" ]; then
  echo "🚨 CRITICAL: Failed to generate non-empty Supabase types into '$OUTPUT_FILE_PATH' for project $SUPABASE_PROJECT_REF after $MAX_RETRIES attempts." >&2
  exit 1
fi
echo "✅ Supabase types generation complete for project $SUPABASE_PROJECT_REF, saved to $OUTPUT_FILE_PATH."