#!/usr/bin/env bash
# File: scripts/generate-directory-structure.sh
# Generates:
# 1. A JSON list of components for the component audit tool.
# 2. A Markdown file representing the project's directory tree.

set -euo pipefail # Ensure pipefail is also set, along with -e and -u

# --- Define Project Root ---
# This assumes the script is being run from the root of the project.
PROJECT_ROOT=$(pwd)

# --- Configuration for JSON Component List ---
JSON_OUTPUT_DIR_RELATIVE="reports" # Relative to project root
JSON_FILENAME="component-structure.json"
JSON_FILEPATH="${PROJECT_ROOT}/${JSON_OUTPUT_DIR_RELATIVE}/${JSON_FILENAME}"

# --- Configuration for Markdown Directory Tree ---
TREE_OUTPUT_DIR_RELATIVE="reports" # Relative to project root
TREE_FILENAME="project-directory-tree.md"
TREE_FILEPATH="${PROJECT_ROOT}/${TREE_OUTPUT_DIR_RELATIVE}/${TREE_FILENAME}"
TREE_TITLE="# Project Directory Structure"
# Updated TREE_EXCLUDE_PATTERN for paths now inside 'src/'
TREE_EXCLUDE_PATTERN="node_modules|.git|.next|*.log*|dist|build|coverage|supabase/.temp|project-planning|src/database/schemas|reports/.DS_Store|src/assets/.DS_Store|docs/.DS_Store|public/.DS_Store"

echo "🔄 Generating outputs..."

# --- 1. Prepare output directories (relative to project root) ---
mkdir -p "${PROJECT_ROOT}/${JSON_OUTPUT_DIR_RELATIVE}"
mkdir -p "${PROJECT_ROOT}/${TREE_OUTPUT_DIR_RELATIVE}" # In case it's different in the future

# --- 2. Generate the component list JSON using embedded Node ---
echo "   Generating component list JSON ($JSON_FILEPATH)..."

# The Node.js script will execute with process.cwd() as PROJECT_ROOT.
# Shell variables JSON_OUTPUT_DIR_RELATIVE and JSON_FILENAME will be expanded into the Node script string.
node << NODE_SCRIPT
const fs = require('fs');
const path = require('path');

// --- Configuration for Node Script ---
const projectRoot = process.cwd();
// Updated to reflect components moving into the 'src' directory
const componentRootDirs = [
    path.join(projectRoot, 'src', 'components') 
];
// Output path for the JSON file, constructed inside Node using process.cwd()
const outputDir = path.join(projectRoot, '${JSON_OUTPUT_DIR_RELATIVE}');
const outputFilePath = path.join(outputDir, '${JSON_FILENAME}');

const excludePatterns = [
    'ui', 
    'typography', 
    'node_modules',
    '.git',
    '.next',
    'index.ts',
    'index.tsx',
    '.DS_Store',
    // Example: '*.stories.tsx', '*.test.tsx' // if you want to exclude these patterns
];

function toPascalCase(str) {
    if (!str) return 'UnnamedComponent';
    const baseName = path.basename(str, path.extname(str));
    return baseName
        .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase())
        .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}

function findComponents(dir, projectRootForAlias) {
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
        // relativePathFromProjectRoot will be e.g., src/components/Button.tsx
        const relativePathFromProjectRoot = path.relative(projectRootForAlias, currentPath);
        const pathSegments = relativePathFromProjectRoot.split(path.sep);
        
        const isExcludedByName = excludePatterns.includes(item.name);
        let isExcludedByParentDir = false;
        // Check if any part of the path up to the component's dir is in excludePatterns
        // e.g. if pathSegments is ['src', 'components', 'ui', 'Button.tsx'], it checks 'src', 'components', 'ui'
        for (let i = 0; i < pathSegments.length -1; i++) { 
            if (excludePatterns.includes(pathSegments[i])) {
                isExcludedByParentDir = true;
                break;
            }
        }
        const isStoryOrTest = item.name.endsWith('.stories.tsx') || item.name.endsWith('.test.tsx');

        if (isExcludedByName || isExcludedByParentDir || isStoryOrTest) {
             continue;
        }

        if (item.isDirectory()) {
            components = components.concat(findComponents(currentPath, projectRootForAlias));
        } else if (item.isFile() && (item.name.endsWith('.tsx'))) {
             const componentName = toPascalCase(item.name);
             if (componentName === 'Index' && (item.name === 'index.tsx' || item.name === 'index.ts')) continue;

             // Adjust aliasPath to be relative to 'src' directory for '@/' imports
             // e.g., currentPath = /project/src/components/Button.tsx
             // path.join(projectRootForAlias, 'src') = /project/src
             // pathInsideSrcDir = components/Button.tsx
             const pathInsideSrcDir = path.relative(path.join(projectRootForAlias, 'src'), currentPath);
             const aliasPath = \`@/\${pathInsideSrcDir.replace(/\\\\/g, '/')}\`;

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
        allComponents = allComponents.concat(findComponents(rootDir, projectRoot));
    } else {
        console.warn(\`   Component directory not found, skipping: \${rootDir}\`);
    }
});

allComponents.sort((a, b) => a.name.localeCompare(b.name));

try {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputFilePath, JSON.stringify(allComponents, null, 2));
    console.log(\`   Component list successfully written to \${outputFilePath}\`);
} catch (writeErr) {
    console.error(\`   Error writing component list JSON to \${outputFilePath}:\`, writeErr);
    throw writeErr; // Re-throw error to ensure shell script exits with non-zero code
}
NODE_SCRIPT
# --- End of Node script marker ---

NODE_EXIT_CODE=$? 

if [ "$NODE_EXIT_CODE" -ne 0 ]; then
 echo "❌ ERROR: Node script for component list generation failed with exit code $NODE_EXIT_CODE." >&2
 exit 1 
fi

# Verify component list JSON was created and is not empty by the bash script
if [ ! -f "$JSON_FILEPATH" ] || [ ! -s "$JSON_FILEPATH" ]; then
  echo "🚨 ERROR: Failed to create or populate $JSON_FILEPATH (verified by bash)." >&2
  exit 1
else
  echo "✅ Component list JSON generated successfully."
fi

echo "" 

# --- 3. Generate the Markdown Directory Tree ---
echo "   Generating Markdown directory tree ($TREE_FILEPATH)..."
if command -v tree &> /dev/null; then
    echo "$TREE_TITLE" > "$TREE_FILEPATH"
    echo "" >> "$TREE_FILEPATH" 
    echo "\`\`\`" >> "$TREE_FILEPATH" 
    # Run tree command from the PROJECT_ROOT, targeting its current directory (./)
    if (cd "$PROJECT_ROOT" && tree -L 4 -aF --noreport -I "$TREE_EXCLUDE_PATTERN" ./ >> "$TREE_FILEPATH"); then
      echo "\`\`\`" >> "$TREE_FILEPATH" 
      echo "✅ Project directory tree saved as $TREE_FILENAME in $TREE_OUTPUT_DIR_RELATIVE/"
    else
      TREE_EXIT_CODE=$?
      echo "⚠️ 'tree' command failed or had issues (exit code: $TREE_EXIT_CODE). Check $TREE_FILEPATH." >&2
      if [ -f "$TREE_FILEPATH" ]; then echo "\`\`\`" >> "$TREE_FILEPATH"; fi
      # set -e will handle exit if tree itself fails.
    fi
else
    echo "⚠️ 'tree' command not found. Skipping Markdown directory tree generation." >&2
fi

# Verify tree file existence (content check might be too strict as it could be just a title)
if command -v tree &> /dev/null; then
  if [ ! -f "$TREE_FILEPATH" ]; then
    echo "🚨 ERROR: Tree command ran but $TREE_FILEPATH was not created." >&2
    exit 1
  fi
fi

echo "✨ Directory structure generation script finished."