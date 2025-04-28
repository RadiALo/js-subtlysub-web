# SubtlySub

SubtlySub is a fullstack web application designed to help users learn English through subtitles.
Find a post about your favorite TV series, movie, or game — and explore all the specific vocabulary used in that content!

## ✨ Features

- 🔍 Learn from content: Study English vocabulary taken directly from subtitles of series, games, and movies.
- ✍️ Create posts: Add your own posts with a title, description, image, and a set of vocabulary cards.
- 📚 Collections: Save posts into personal collections for easier access and learning.
- 🌐 Multilingual support: Available in English and Ukrainian via react-i18next.
- ✉️ Email verification: Secure registration and login using SMTP email verification.
- 🔑 Authentication & Authorization: JWT-based authentication system with multiple user roles (User, Moderator, Admin).
- 🛡️ Moderation: All user-submitted posts require approval by a Moderator or Admin before becoming publicly available.

## 🛠️ Technology Stack

### Backend

- Node.js + Express.js
- Prisma ORM for database management
- JWT for authentication and role-based access control
- SMTP integration for email verification

### Frontend

- React (with TypeScript)
- Vite for blazing fast development
- Tailwind CSS for modern and responsive styling
- react-i18next for internationalization

## 🚀 Getting Started

### Backend Setup
```
cd subtlysub-backend
npm install
npm run start
```

### Frontend Setup
```
cd subtlysub-frontend
npm install
npm run dev
```

## 📅 Roadmap

- 📈 Add AI-generated vocabulary examples
- 📱 Mobile responsive improvements
- 🎮 Progress tracking and gamification

## 🤝 Contributing

Contributions are welcome!

Please feel free to submit a Pull Request or open an Issue for any bugs, ideas, or feature requests.