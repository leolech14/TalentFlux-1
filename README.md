# TalentFlux - AI-Powered HR SaaS Platform

TalentFlux is a modern HR SaaS platform that connects talented professionals with innovative companies using AI-powered matching and conversational interfaces.

## 🚀 Features

- **AI-Powered Matching**: Advanced algorithms analyze skills, experience, and cultural fit
- **Voice-Enabled CV Creator**: Create professional CVs using voice commands
- **Email CV Delivery**: Send generated CVs directly via email with beautiful templates (powered by Resend)
- **Conversational Interface**: Natural interaction with AI assistant
- **Multi-Theme Support**: Light, Dark, Alternative, and Minimal themes
- **Real-time Analytics**: Data-driven insights for hiring optimization
- **Drag-and-Drop Dashboard**: Customizable widgets and layouts

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use free Neon.tech)
- OpenAI API key (for AI features)

## 🛠️ Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TalentFlux-1-1.git
   cd TalentFlux-1-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   npm run setup
   ```
   This will create `.env` and `.env.example` files with required configuration.

4. **Configure your database**
   - Get a free PostgreSQL at [Neon.tech](https://neon.tech)
   - Copy your connection string
   - Add it to `DATABASE_URL` in `.env`

5. **Add OpenAI API key**
   - Get your API key from [OpenAI Platform](https://platform.openai.com)
   - Add it to `OPENAI_API_KEY` in `.env`

6. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5000

## 🔧 Manual Environment Setup

If you prefer to set up manually, create a `.env` file with:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-random-session-secret

# Optional: LinkedIn OAuth
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback

# Optional: Email Configuration with Resend (see EMAIL_SETUP.md for details)
RESEND_API_KEY=re_your_api_key_here
```

## 🏗️ Project Structure

```
TalentFlux-1-1/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   └── pages/
├── server/          # Express backend
│   ├── routes.ts
│   ├── db.ts
│   └── index.ts
├── shared/          # Shared types and schemas
├── ai/              # AI integration modules
└── scripts/         # Utility scripts
```

## 🎨 Available Themes

- **Light**: Clean, professional appearance
- **Dark**: Cyberpunk-inspired with neon accents
- **Alternative**: Forest midnight theme
- **Minimal**: Terminal-style black and white

## 🐛 Troubleshooting

### Database Connection Error
If you see `DATABASE_URL must be set`:
1. Make sure you've created a `.env` file
2. Add your database connection string
3. Run `npm run setup` if you haven't already

### Port Already in Use
If port 5000 is already in use:
1. Change the `PORT` in your `.env` file
2. Or kill the process using the port: `lsof -ti:5000 | xargs kill`

### Missing Dependencies
If you encounter module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Available Scripts

- `npm run setup` - Set up environment configuration
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- Styled with Tailwind CSS
- Powered by OpenAI and Neon Database
- UI components from Radix UI 