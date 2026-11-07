
#!/bin/bash

set -e

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Error: Not inside a Git repository."
    exit 1
fi

echo "Enter commit message:"
read -r message

if [ -z "$message" ]; then
    echo "Error: Commit message cannot be empty."
    exit 1
fi

branch=$(git branch --show-current)

if [ -z "$branch" ]; then
    echo "Error: No current branch."
    exit 1
fi

mapfile -d '' files < <(git status --porcelain -z | while IFS= read -r -d '' entry; do
    status="${entry:0:2}"
    file="${entry:3}"

    if [[ "$status" == *R* || "$status" == *C* ]]; then
        IFS= read -r -d '' newfile || true
        printf '%s\0' "$newfile"
    else
        printf '%s\0' "$file"
    fi
done)

if [ ${#files[@]} -eq 0 ]; then
    echo "No changes to commit."
    exit 0
fi

for file in "${files[@]}"; do
    echo "Committing: $file"

    git add -A -- "$file"

    if ! git diff --cached --quiet; then
        git commit -m "$message: $file"
    fi
done

echo "Pushing commits to origin/$branch..."

git push -u origin "$branch"

echo "All files committed and pushed successfully!"
