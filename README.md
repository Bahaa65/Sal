# Sal - Q&A Platform

A modern, responsive question and answer platform built with React, TypeScript, and Chakra UI. Users can ask questions, provide answers, vote on content, and interact with other users in a clean and intuitive interface.

## 🚀 Features

### Core Functionality
- **Ask Questions**: Create and publish questions with rich text content
- **Answer System**: Provide detailed answers to questions
- **Voting System**: Upvote and downvote questions and answers
- **User Profiles**: View and edit user profiles with avatars
- **Real-time Notifications**: Get notified about new answers, votes, and mentions
- **Search & Filter**: Find questions and answers easily

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Infinite Scroll**: Smooth loading of content without pagination
- **Click Navigation**: Intuitive card-based navigation throughout the app
- **Profile Dropdown**: Quick access to profile and logout from any page

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **React Query**: Efficient data fetching and caching
- **Chakra UI**: Consistent and accessible component library
- **React Router**: Client-side routing with protected routes
- **Authentication**: Secure login/register system with token management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **React Router DOM** - Routing
- **React Icons** - Icon library

### State Management & Data
- **React Query (TanStack Query)** - Server state management
- **React Context** - Client state management
- **Axios** - HTTP client

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/Bahaa65/Sal.git
   cd Sal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── home/           # Home page components
│   └── PageTransition.tsx
├── contexts/           # React contexts
├── forms/              # Form components
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Home/           # Main app pages
│   ├── Profile/        # Profile pages
│   └── Test/           # Testing pages
├── services/           # API services
├── theme/              # Chakra UI theme
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Configuration

The app connects to a backend API. Configuration can be found in:
- `src/services/apiClient.ts` - API client setup
- `src/utils/constants.ts` - API endpoints and constants
- `vite.config.ts` - Proxy configuration for development

## 🎨 UI/UX Features

### Design System
- **Consistent Icons**: Unified icon system using React Icons
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback for actions
- **Modal Dialogs**: Confirmation dialogs and forms

### Navigation
- **Header Navigation**: Profile dropdown, notifications
- **Card-based Navigation**: Clickable question and answer cards
- **Breadcrumb Navigation**: Easy back navigation
- **Protected Routes**: Authentication-based access control

## 🔒 Authentication

- **JWT Tokens**: Secure authentication
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Profile Management**: User profile editing and avatar upload
- **Session Persistence**: Automatic token refresh

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Streamlined mobile experience

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic chunk splitting for faster loading
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized avatar and image loading
- **Caching**: React Query for efficient data caching
- **Bundle Optimization**: Minified production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bahaa** - [GitHub Profile](https://github.com/Bahaa65)

## 🙏 Acknowledgments

- [Chakra UI](https://chakra-ui.com/) for the amazing component library
- [React Query](https://tanstack.com/query) for efficient data fetching
- [Vite](https://vitejs.dev/) for the fast build tool
- [React Icons](https://react-icons.github.io/react-icons/) for the icon library

---

⭐ If you find this project helpful, please give it a star!
