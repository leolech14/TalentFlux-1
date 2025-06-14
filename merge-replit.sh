#!/bin/bash

echo "=== Automated Replit Merge Script ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if branch exists on remote
check_remote_branch() {
    git ls-remote --heads origin $1 | grep -q $1
    return $?
}

# Step 1: Fetch latest from origin
echo -e "${YELLOW}Fetching latest changes from origin...${NC}"
git fetch origin

# Step 2: Check if replit-updates branch exists
if check_remote_branch "replit-updates"; then
    echo -e "${GREEN}Found replit-updates branch on remote!${NC}"
else
    echo -e "${RED}No replit-updates branch found on remote.${NC}"
    echo "Please run the following commands on Replit first:"
    echo ""
    echo "  git checkout -b replit-updates"
    echo "  git push -u origin replit-updates"
    echo ""
    exit 1
fi

# Step 3: Ensure we're on main
echo -e "${YELLOW}Switching to main branch...${NC}"
git checkout main

# Step 4: Pull latest main
echo -e "${YELLOW}Pulling latest main...${NC}"
git pull origin main

# Step 5: Create merge branch
echo -e "${YELLOW}Creating merge branch...${NC}"
git checkout -b merge-replit-$(date +%Y%m%d-%H%M%S)

# Step 6: Attempt merge
echo -e "${YELLOW}Attempting to merge replit-updates...${NC}"
if git merge origin/replit-updates --no-edit; then
    echo -e "${GREEN}Merge successful!${NC}"
    
    # Step 7: Run tests
    echo -e "${YELLOW}Running build to verify...${NC}"
    if npm run build; then
        echo -e "${GREEN}Build successful!${NC}"
        
        # Step 8: Push to main
        echo -e "${YELLOW}Merging to main...${NC}"
        git checkout main
        git merge --no-ff merge-replit-$(date +%Y%m%d-%H%M%S) -m "Merge replit-updates into main"
        
        echo -e "${GREEN}Ready to push to origin/main${NC}"
        echo "Run 'git push origin main' to complete the merge"
    else
        echo -e "${RED}Build failed! Please fix errors before merging.${NC}"
        exit 1
    fi
else
    echo -e "${RED}Merge conflicts detected!${NC}"
    echo ""
    echo "Conflicts in the following files:"
    git diff --name-only --diff-filter=U
    echo ""
    echo "Please resolve conflicts manually, then run:"
    echo "  git add ."
    echo "  git commit"
    echo "  npm run build"
    echo "  git checkout main"
    echo "  git merge --no-ff <your-merge-branch>"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Merge process complete! ===${NC}" 