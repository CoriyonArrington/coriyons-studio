#!/usr/bin/env bash
# File: scripts/generate-directory-structure.sh
# Generates:
# 1. A JSON list of components for the component audit tool.
# 2. A Markdown file representing the project's directory tree.

set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration for JSON Component List ---
JSON_OUTPUT_DIR="reports"
JSON_FILENAME="component-structure.json"
JSON_FILEPATH="$JSON_OUTPUT_DIR/$JSON_FILENAME"

# --- Configuration for Markdown Directory Tree ---
TREE_OUTPUT_DIR="reports" # Or choose 'docs' or another location
TREE_FILENAME="project-directory-tree.md" # Changed from timestamped, generic name
TREE_FILEPATH="$TREE_OUTPUT_DIR/$TREE_FILENAME"
TREE_TITLE="# Project Directory Structure"
TREE_EXCLUDE_PATTERN="node_modules|.git|.next|*.log*|dist|build|coverage|supabase/.temp|project-planning|database/schemas" # Added more exclusions

echo "🔄 Generating outputs..."

# --- 1. Prepare output folder for JSON (also used by Markdown tree) ---
mkdir -p "$JSON_OUTPUT_DIR"
mkdir -p "$TREE_OUTPUT_DIR" # Ensure tree output directory also exists

# --- 2. Generate the component list JSON using embedded Node ---
echo "   Generating component list JSON ($JSON_FILEPATH)..."
# Run the Node script. Output goes directly to the file via fs.writeFileSync.
node << NODE
const fs = require('fs');
const path = require('path');

// --- Configuration for Node Script ---
const componentRootDirs = [
    path.join(process.cwd(), 'components')
];
// Corrected path usage from shell variable
const outputFilePath = path.join(process.cwd(), '$JSON_FILEPATH');

const excludePatterns = [
    'ui',
    'typography',
    'node_modules',
    '.git',
    '.next',
    'index.ts', // Exclude index.ts files by name
    '.DS_Store',
];

function toPascalCase(str) {
    if (!str) return 'UnnamedComponent';
    const baseName = path.basename(str, path.extname(str));
    return baseName
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

function findComponents(dir, basePath) {
    let components = [];
    let items;
    try {
        items = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
        console.error(\`Error reading directory: \${dir}\`, err);
        return [];
    }

    for (const item of items) {
        const currentPath = path.join(dir, item.name);
        const relativePath = path.relative(basePath, currentPath);
        const pathSegments = relativePath.split(path.sep);
        const isExcluded = excludePatterns.includes(item.name) || 
                           (pathSegments.length > 0 && excludePatterns.includes(pathSegments[0]));

        if (isExcluded) {
             continue;
        }

        if (item.isDirectory()) {
            components = components.concat(findComponents(currentPath, basePath));
        } else if (item.isFile() && (item.name.endsWith('.tsx'))) {
             const componentName = toPascalCase(item.name);
             if (componentName === 'Index') continue;

             const aliasPath = \`@/\${path.relative(process.cwd(), currentPath).replace(/\\\\/g, '/')}\`;

             try {
                 const content = fs.readFileSync(currentPath, 'utf8');
                 if (content.includes('export function') || content.includes('export default') || content.includes('export const')) {
                     components.push({
                         name: componentName,
                         location: aliasPath,
                         status: "Needs Review",
                         usageCount: 0,
                         notes: ""
                     });
                 }
             } catch (readErr) {
                 console.error(\`Error reading file: \${currentPath}\`, readErr);
             }
        }
    }
    return components;
}

let allComponents = [];
componentRootDirs.forEach(rootDir => {
    console.log(\`   Scanning component directory: \${rootDir}\`);
    if(fs.existsSync(rootDir)){
        allComponents = allComponents.concat(findComponents(rootDir, rootDir));
    } else {
        console.warn(\`   Component directory not found, skipping: \${rootDir}\`);
    }
});

allComponents.sort((a, b) => a.name.localeCompare(b.name));

try {
    fs.writeFileSync(outputFilePath, JSON.stringify(allComponents, null, 2));
    console.log(\`   Component list successfully written to \${outputFilePath}\`);
    process.exit(0);
} catch (writeErr) {
    console.error(\`   Error writing component list JSON to \${outputFilePath}:\`, writeErr);
    process.exit(1);
}
NODE
# --- End of Node script marker ---

NODE_EXIT_CODE=$?
if [ "$NODE_EXIT_CODE" -eq 0 ]; then
 echo "✅ Component list JSON generated successfully."
else
 echo "❌ Failed to generate component list JSON (Node script exited with code $NODE_EXIT_CODE)."
 # Decide if you want to exit the whole script or continue to tree generation
 # exit 1 
fi

echo "" # Newline for readability

# --- 3. Generate the Markdown Directory Tree ---
echo "   Generating Markdown directory tree ($TREE_FILEPATH)..."
if command -v tree &> /dev/null
then
    # Add title to the Markdown file
    echo "$TREE_TITLE" > "$TREE_FILEPATH"
    echo "" >> "$TREE_FILEPATH" # Add a newline
    echo "\`\`\`" >> "$TREE_FILEPATH" # Start code block for tree
    # Run tree command, append its output to the file
    tree -L 4 -aF --noreport -I "$TREE_EXCLUDE_PATTERN" ./ >> "$TREE_FILEPATH" # -L 4 for depth, -a for all files, -F to classify, --noreport
    echo "\`\`\`" >> "$TREE_FILEPATH" # End code block
    echo "✅ Project directory tree saved as $TREE_FILENAME in $TREE_OUTPUT_DIR/"
else
    echo "⚠️ 'tree' command not found. Skipping Markdown directory tree generation."
    echo "   To install 'tree' on macOS: brew install tree"
    echo "   To install 'tree' on Debian/Ubuntu: sudo apt install tree"
fi

echo "✨ Script finished."