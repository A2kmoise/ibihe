
#!/bin/bash

echo "Enter commit message:"
read -r message

if [ -z "$message" ]; then
    echo "Error: Commit message cannot be empty."
    exit 1
fi

git add -A

if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 0
fi

git commit -m "$message" || exit 1

branch=$(git branch --show-current)

echo "Pushing to origin/$branch..."

git push -u origin "$branch" || exit 1

echo "Successfully committed and pushed!"
