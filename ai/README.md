# TalentFlux Repo-Aware AI Assistant

A context-aware OpenAI helper that indexes the entire TalentFlux repository and answers code requests on demand.

## Features

- **Zero-guess refactors** – describe a change; agent returns a patch
- **Light-speed bug triage** – paste stack-trace; agent locates root cause
- **Automated docs/tests** – generate Playwright tests, documentation
- **Style-guide gatekeeper** – find violations of palette tokens and design patterns
- **Knowledge onboarding** – new developers can query how features work

## Setup

The AI assistant is already configured with:
- OpenAI embeddings for semantic code search
- Repository indexing with 1KB chunks
- Automatic re-indexing when files change
- Mobile-first, AI-first architectural awareness

## Usage

### Basic Commands

```bash
# Ask a question about the codebase
npx tsx ai/agent.ts "Where is the FAB clamp?"

# Get refactoring suggestions
npx tsx ai/agent.ts "Refactor theme toggle to Context API"

# Generate tests
npx tsx ai/agent.ts "Generate Playwright test for sidebar dismiss"

# Find design violations
npx tsx ai/agent.ts "Find inline colors violating palette tokens"

# Get help
npx tsx ai/agent.ts help
```

### Advanced Features

```bash
# Force re-index the repository
npx tsx ai/agent.ts --index

# Start watch mode (auto re-index on file changes)
npx tsx ai/agent.ts --watch
```

## Daily Workflow

1. **Code → Save** – embeddings auto-refresh in watch mode
2. **Query** – run commands to get contextual assistance
3. **Review** – examine generated diffs and suggestions
4. **Apply** – copy-paste or pipe to `patch -p1`
5. **Commit** – CI runs visual/singleton/WCAG checks

## How It Works

1. **Indexing**: Walks the repository and creates 1KB code chunks
2. **Embeddings**: Uses OpenAI text-embedding-3-small for semantic understanding
3. **Search**: Cosine similarity matching for relevant code context
4. **Generation**: GPT-4o with repository context and TalentFlux patterns

## Architecture Awareness

The agent understands TalentFlux's specific patterns:
- Mobile-first responsive design
- Single Magic Star FAB principle
- Tap-to-dismiss interaction patterns
- Widget-based modular architecture
- Theme system and color palette
- Authentication and routing patterns

## Benefits

- Keeps everyone aligned with mobile-first + AI-first rules
- Reduces blind errors by suggesting fixes before build breaks
- Acts as living documentation – the repo talks back
- Accelerates onboarding for new team members

## Important Notes

- The agent is a **helper**, not an auto-merger
- Always review generated diffs before applying
- Requires OPENAI_API_KEY environment variable
- Re-indexes automatically when git changes are detected

## Examples

### Finding Features
```bash
npx tsx ai/agent.ts "How does the CV creation workflow work?"
```

### Debugging
```bash
npx tsx ai/agent.ts "Why is the assistant overlay not opening when I click the button?"
```

### Refactoring
```bash
npx tsx ai/agent.ts "Convert the theme toggle to use React Context instead of Zustand"
```

### Testing
```bash
npx tsx ai/agent.ts "Write a test that verifies the Magic Star FAB boundary clamping"
```