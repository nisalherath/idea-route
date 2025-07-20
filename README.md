# Idea Route - Suggestion App

A modern, production-ready Next.js application for sharing and discovering suggestions from the community. Built with React 19, Next.js 15, TypeScript, and Firebase.

## Quick Start

```bash
git clone <your-repo-url>
cd idea-route
npm install
npm run dev
```

## Features

- **Complete Authentication System** - Email/password + Google OAuth
- **Modern UI/UX** - Mobile-first responsive design with SweetAlert2 notifications
- **Security First** - Password encryption, input sanitization, protected routes
- **Production Ready** - TypeScript, Firebase integration, deployment ready

## Documentation

📖 **[Complete Documentation](./DOCUMENTATION.md)** - Comprehensive guide covering:
- Firebase setup and configuration
- Google OAuth implementation
- Environment variables
- Firestore security rules
- Authentication system
- Deployment instructions
- API reference

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: CSS Modules
- **Notifications**: SweetAlert2

## Environment Setup

Create `.env.local` with your Firebase and Google OAuth credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## License

MIT License
