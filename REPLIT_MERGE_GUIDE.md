# Replit Merge Guide

## Current Situation
- Local/GitHub main branch: Has latest theme fixes
- Replit: Has 8 commits ahead (not pushed to GitHub)

## Step 1: On Replit Console

Run these commands to push Replit changes to a new branch:

```bash
# Check current status
git status

# See what branch you're on
git branch

# If you're on main, create a new branch
git checkout -b replit-updates

# Push this branch to GitHub
git push -u origin replit-updates
```

## Step 2: On Local Machine (After Replit Push)

Once Replit has pushed their branch, run:

```bash
# Fetch the new branch
git fetch origin

# Switch back to main
git checkout main

# Create a merge branch
git checkout -b merge-replit-changes

# Merge the replit branch
git merge origin/replit-updates

# If there are conflicts, resolve them
# Then commit the merge
git add .
git commit -m "Merge replit-updates into main"

# Push to main
git checkout main
git merge merge-replit-changes
git push origin main
```

## Alternative: If Replit Can't Push

If Replit can't push directly, you can:

1. On Replit, create a patch file:
```bash
git format-patch -8 HEAD
```

2. Download the patch files and apply them locally:
```bash
git am *.patch
```

## Handling Conflicts

Common conflict areas might be:
- `package.json` - Different dependencies
- `.env` files - Different environment variables
- `client/src/index.css` - Theme changes
- `tailwind.config.ts` - Configuration changes

For each conflict:
1. Open the file
2. Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
3. Decide which changes to keep
4. Remove the conflict markers
5. Save and stage the file 