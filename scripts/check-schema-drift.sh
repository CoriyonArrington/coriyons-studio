#!/usr/bin/env bash
# File: scripts/check-schema-drift.sh
# Checks if the local Supabase types file matches the remote schema.
# Relies on user being logged in via 'supabase login'.

set -euo pipefail # Exit on error, undefined variable, or pipe failure

# --- Project Reference ID ---
# Ensure this matches your Supabase project ref
SUPABASE_PROJECT_REF="lqwajjazuknoyykqznmr"

# --- 2. Define local types file path ---
LOCAL_TYPES_FILE="types/supabase.ts"

if [ ! -f "$LOCAL_TYPES_FILE" ]; then
    echo "🚨 Local types file not found at '$LOCAL_TYPES_FILE'. Cannot check for drift." >&2
    exit 1
fi

# --- 3. Generate live schema to temporary file and diff ---
TMP_TYPES_FILE="$(mktemp)"
# Ensure temp file is cleaned up on script exit (success or failure)
trap 'rm -f "$TMP_TYPES_FILE"' EXIT

echo "🔍 Generating temporary live schema types from REMOTE project $SUPABASE_PROJECT_REF..."

# Generate types from remote schema into the temporary file
# Redirect stderr of supabase gen types to /dev/null to silence update notifications
if ! supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > "$TMP_TYPES_FILE" 2>/dev/null; then
    echo "🚨 Failed to generate types from remote schema for project $SUPABASE_PROJECT_REF (Supabase CLI command failed)." >&2
    echo "   Check CLI login ('supabase login'), network connection, and project status on Supabase dashboard." >&2
    exit 1
fi

# Add check to ensure the temporary file is not empty
if [ ! -s "$TMP_TYPES_FILE" ]; then
    echo "🚨 Generated temporary types file '$TMP_TYPES_FILE' is empty after Supabase CLI command." >&2
    echo "   This may indicate an issue with type generation despite the CLI command exiting successfully." >&2
    exit 1
fi

echo "🆚 Comparing checked-in types ($LOCAL_TYPES_FILE) with live schema..."

# Compare the content of the local file with the content of the temporary file generated from remote.
# Using process substitution <(cat ...) to ensure diff operates on content streams,
# which can sometimes help with subtle file handling issues.
if ! diff -u <(cat "$LOCAL_TYPES_FILE") <(cat "$TMP_TYPES_FILE"); then
    # Differences found
    echo # Add a newline for spacing before the error message
    echo "🚨 Schema drift detected!"
    echo "   The checked-in types in '$LOCAL_TYPES_FILE' do not match the live database schema for project $SUPABASE_PROJECT_REF."
    echo "   Run 'npm run types:generate' to update '$LOCAL_TYPES_FILE'."
    exit 1 # Exit with error code to indicate drift
else
    # No differences
    echo "✅ No schema drift detected for project $SUPABASE_PROJECT_REF."
    exit 0 # Exit successfully
fi