#!/usr/bin/env bash
# File: scripts/check-schema-drift.sh
# Checks if the local Supabase types file matches the remote schema.

set -euo pipefail 

SUPABASE_PROJECT_REF="lqwajjazuknoyykqznmr"
LOCAL_TYPES_FILE="types/supabase.ts"

if [ ! -f "$LOCAL_TYPES_FILE" ]; then
    echo "🚨 Local types file not found at '$LOCAL_TYPES_FILE'. Cannot check for drift." >&2
    exit 1
fi

TMP_TYPES_FILE="$(mktemp)"
trap 'rm -f "$TMP_TYPES_FILE"' EXIT

echo "🔍 Generating temporary live schema types from REMOTE project $SUPABASE_PROJECT_REF..."
if ! supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > "$TMP_TYPES_FILE" 2>/dev/null; then
    echo "🚨 Failed to generate types from remote schema for project $SUPABASE_PROJECT_REF (Supabase CLI command failed)." >&2
    echo "   Check CLI login ('supabase login'), network connection, and project status on Supabase dashboard." >&2
    exit 1
fi

if [ ! -s "$TMP_TYPES_FILE" ]; then
    echo "🚨 Generated temporary types file '$TMP_TYPES_FILE' is empty after Supabase CLI command." >&2
    echo "   This may indicate an issue with type generation despite the CLI command exiting successfully." >&2
    exit 1
fi

echo "🆚 Comparing checked-in types ($LOCAL_TYPES_FILE) with live schema..."
if ! diff -u "$LOCAL_TYPES_FILE" "$TMP_TYPES_FILE"; then
    echo # Add a newline for spacing before the error message
    echo "🚨 Schema drift detected!"
    echo "   The checked-in types in '$LOCAL_TYPES_FILE' do not match the live database schema for project $SUPABASE_PROJECT_REF."
    echo "   Run 'npm run types:generate' to update '$LOCAL_TYPES_FILE'."
    exit 1 
else
    echo "✅ No schema drift detected for project $SUPABASE_PROJECT_REF."
    exit 0 
fi