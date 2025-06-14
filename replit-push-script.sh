#!/bin/bash

echo "=== Replit Git Sync Script ==="
echo "This script will help push Replit changes to GitHub"
echo ""

# Show current status
echo "1. Current Git Status:"
git status
echo ""

# Show current branch
echo "2. Current Branch:"
git branch --show-current
echo ""

# Show recent commits
echo "3. Recent Commits:"
git log --oneline -10
echo ""

# Show remotes
echo "4. Git Remotes:"
git remote -v
echo ""

# Create and push replit branch
echo "5. Creating replit branch and pushing..."
git checkout -b replit-changes
git push -u origin replit-changes

echo ""
echo "=== Done! ==="
echo "The replit-changes branch has been pushed to GitHub."
echo "You can now merge it on your local machine." 