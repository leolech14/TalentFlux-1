#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('🚀 TalentFlux Environment Setup\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      process.exit(0);
    }
    createEnvFile();
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  const envContent = `# Database Configuration
# Get your free PostgreSQL database at https://neon.tech
# Format: postgresql://user:password@host/database?sslmode=require
DATABASE_URL=

# OpenAI API Key (for AI features)
OPENAI_API_KEY=

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret (generate a random string)
SESSION_SECRET=${generateRandomString(32)}

# Optional: LinkedIn OAuth (if using LinkedIn login)
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback
`;

  fs.writeFileSync(envPath, envContent);
  fs.writeFileSync(envExamplePath, envContent.replace(generateRandomString(32), 'your-session-secret-here-change-this-in-production'));
  
  console.log('\n✅ Created .env and .env.example files!');
  console.log('\n📝 Next steps:');
  console.log('1. Get a free PostgreSQL database at https://neon.tech');
  console.log('2. Copy your connection string and add it to DATABASE_URL in .env');
  console.log('3. Get an OpenAI API key from https://platform.openai.com');
  console.log('4. Add your OpenAI API key to OPENAI_API_KEY in .env');
  console.log('\nThen run: npm run dev');
  
  rl.close();
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 