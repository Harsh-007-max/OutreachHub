#!/usr/bin/zsh

# Check for required tools
if ! command -v sass &> /dev/null; then
    echo "❌ Sass not installed. Run: npm install -g sass"
    exit 1
fi

if ! command -v inotifywait &> /dev/null; then
    echo "❌ inotify-tools not installed. Run: sudo apt install inotify-tools"
    exit 1
fi

echo "👀 Watching ./scss and all subfolders for ANY changes..."

mkdir -p ./css

# Start watching recursively
inotifywait -mrq -e close_write,create,delete ./scss | while read -r directory event filename; do
    # Check if it's an SCSS file (partial or not)
    if [[ "$filename" == *.scss ]]; then
        echo "📦 Detected change: $directory$filename"

        # Recompile all NON-PARTIAL scss files
        find ./scss -type f -name "*.scss" ! -name "_*.scss" | while read -r scss_file; do
            relative_path="${scss_file#./scss/}"
            css_output="./css/${relative_path%.scss}.css"
            mkdir -p "$(dirname "$css_output")"
            sass "$scss_file" "$css_output"
            echo "✅ Compiled: $scss_file → $css_output"
        done

        echo "🔁 Watching for more changes..."
    fi
done

# echo "Converting all SCSS files into CSS files"
# find ./scss -type f -name "*.scss" ! -name "_*.scss" | while read -r scss_file; do
#     # Get the relative path from ./scss/ and change .scss to .css
#     relative_path="${scss_file#./scss/}"
#     css_output="./css/${relative_path%.scss}.css"

#     # Ensure the output directory exists for nested files
#     mkdir -p "$(dirname "$css_output")"

#     echo "📦 Compiling: $scss_file → $css_output"
#     sass "$scss_file" "$css_output"
# done

# echo "✅ All SCSS files compiled into ./css/"
