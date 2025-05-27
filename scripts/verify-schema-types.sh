#!/usr/bin/env bash
# File: scripts/verify-schema-types.sh
# Purpose: Compares local types/supabase.ts against fresh remote types.
# Exits 0 if no drift, 1 if drift is detected or an error occurs.

set -euo pipefail

SUPABASE_PROJECT_REF="lqwajjazuknoyykqznmr" 
LOCAL_TYPES_FILE="types/supabase.ts"
MAX_RETRIES_FOR_TEMP_GEN=3 
RETRY_DELAY_SECONDS=3

echo "🔎 Verifying local Supabase types in '$LOCAL_TYPES_FILE' against remote schema..."

if [ ! -f "$LOCAL_TYPES_FILE" ]; then
    echo "🚨 Local types file '$LOCAL_TYPES_FILE' not found." >&2
    echo "   Run 'bash scripts/update-supabase-types.sh' to generate it." >&2
    exit 1
fi

TEMP_REMOTE_TYPES_FILE="" 
CLI_STDERR_FILE_VERIFY=""
DIFF_OUTPUT_FILE="" # Initialize

_cleanup_verify_temps() {
  rm -f "$TEMP_REMOTE_TYPES_FILE" "$CLI_STDERR_FILE_VERIFY" "$DIFF_OUTPUT_FILE"
}
trap _cleanup_verify_temps EXIT INT TERM

RETRY_COUNT=0
REMOTE_GEN_SUCCESSFUL=false

# echo "   Generating fresh types from remote into a temporary file for comparison..." # Less verbose
while [ $RETRY_COUNT -lt $MAX_RETRIES_FOR_TEMP_GEN ] && [ "$REMOTE_GEN_SUCCESSFUL" = "false" ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  TEMP_REMOTE_TYPES_FILE="$(mktemp)" 
  CLI_STDERR_FILE_VERIFY="$(mktemp)" 

  if [ $RETRY_COUNT -gt 1 ]; then
    echo "      Retrying temporary type generation (attempt $RETRY_COUNT of $MAX_RETRIES_FOR_TEMP_GEN) after $RETRY_DELAY_SECONDS second(s)..." >&2
    sleep $RETRY_DELAY_SECONDS
  fi
  
  CLI_EXIT_CODE=0
  # We are NOT silencing supabase gen types stderr here to capture it.
  if ! (supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > "$TEMP_REMOTE_TYPES_FILE" 2> "$CLI_STDERR_FILE_VERIFY"); then
    CLI_EXIT_CODE=$?
  fi

  if [ "$CLI_EXIT_CODE" -eq 0 ]; then
    if [ -s "$TEMP_REMOTE_TYPES_FILE" ]; then
      REMOTE_GEN_SUCCESSFUL=true
    else
      echo "   ⚠️ Supabase CLI 'gen types' for comparison succeeded (exit 0) but produced an empty temp file (attempt $RETRY_COUNT)." >&2
      if [ -s "$CLI_STDERR_FILE_VERIFY" ]; then echo "      Supabase CLI stderr:" >&2; cat "$CLI_STDERR_FILE_VERIFY" >&2; else echo "      Supabase CLI stderr was empty." >&2; fi
    fi
  else
    echo "   ⚠️ Supabase CLI 'gen types' for comparison failed (exit $CLI_EXIT_CODE, attempt $RETRY_COUNT)." >&2
    if [ -s "$CLI_STDERR_FILE_VERIFY" ]; then echo "      Supabase CLI stderr:" >&2; cat "$CLI_STDERR_FILE_VERIFY" >&2; else echo "      Supabase CLI stderr was empty." >&2; fi
  fi
  
  # Clean up iteration-specific stderr, but keep TEMP_REMOTE_TYPES_FILE if successful for the diff
  if [ "$REMOTE_GEN_SUCCESSFUL" = "false" ] && [ -n "$TEMP_REMOTE_TYPES_FILE" ] && [ -f "$TEMP_REMOTE_TYPES_FILE" ]; then
    rm -f "$TEMP_REMOTE_TYPES_FILE"
  fi
  rm -f "$CLI_STDERR_FILE_VERIFY" 
done

if [ "$REMOTE_GEN_SUCCESSFUL" = "false" ]; then
  echo "🚨 CRITICAL: Failed to generate fresh remote types for comparison after $MAX_RETRIES_FOR_TEMP_GEN attempts. Cannot verify schema." >&2
  exit 1 
fi

# echo "   Comparing '$LOCAL_TYPES_FILE' with fresh remote types..." # Less verbose
DIFF_OUTPUT_FILE="$(mktemp)" 
# Trap will clean up $TEMP_REMOTE_TYPES_FILE and $DIFF_OUTPUT_FILE

if diff -u "$LOCAL_TYPES_FILE" "$TEMP_REMOTE_TYPES_FILE" > "$DIFF_OUTPUT_FILE" 2>&1; then
  echo "✅ No schema drift detected. '$LOCAL_TYPES_FILE' is up-to-date with the remote schema."
  exit 0
else
  echo "🚨 Schema drift DETECTED!" >&2
  echo "   Your local '$LOCAL_TYPES_FILE' differs from the live database schema." >&2
  if [ -s "$DIFF_OUTPUT_FILE" ]; then
    echo "   Differences found (local vs remote):" >&2
    cat "$DIFF_OUTPUT_FILE" >&2
  else
    echo "   'diff' command indicated differences but produced no output (this is unusual if files truly differ)." >&2
  fi
  echo "" >&2
  echo "   To fix this, run: bash scripts/update-supabase-types.sh" >&2
  echo "   Then, add and commit the updated 'types/supabase.ts' file." >&2
  exit 1 
fi