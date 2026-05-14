# ProjectCamp Frontend

## Project Overview

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx    # Main layout wrapper
│   │   ├── Navbar.jsx    # Top navigation
│   │   ├── Sidebar.jsx   # Left sidebar navigation
│   │   ├── ProtectedRoute.jsx
│   │   └── ui.jsx        # Reusable UI components (Button, Input, Card, etc.)
│   ├── pages/            # Page components (full pages)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProjectList.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── TaskDetail.jsx
│   │   └── NotFound.jsx
│   ├── services/         # API calls
│   │   ├── api.js       # Axios instance with interceptors
│   │   └── index.js     # API endpoints
│   ├── store/           # State management (Zustand)
│   │   └── index.js     # Auth, Project, Task, Note stores
│   ├── hooks/           # Custom React hooks
│   │   └── index.js     # useForm, useAsync, useLocalStorage
│   ├── utils/           # Utility functions
│   │   └── helpers.js   # Date formatting, validation, etc.
│   ├── styles/          # Global styles
│   │   └── index.css    # Tailwind + custom sketchy styles
│   ├── App.jsx          # Main app component with routing
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.js       # Vite configuration
├── package.json
└── .env.example         # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on http://localhost:8000

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env.local file**

   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Key Features Implementation

### Authentication

- User registration with email verification
- Login/Logout with JWT tokens
- Password reset functionality
- Token refresh mechanism
- Protected routes

**Files**: `pages/Login.jsx`, `pages/Register.jsx`, `services/index.js`

### Project Management

- Create, read, update, delete projects
- View project members
- Add/remove team members
- Role-based access control

**Files**: `pages/Dashboard.jsx`, `pages/ProjectList.jsx`, `pages/ProjectDetail.jsx`

### Task Management

- Create, read, update, delete tasks
- Assign tasks to team members
- Track task status (Todo, In Progress, Done)
- File attachments support

**Files**: `pages/ProjectDetail.jsx`, `pages/TaskDetail.jsx`

### Subtask Management

- Create subtasks within tasks
- Mark subtasks as complete
- Progress tracking with visual indicators

**Files**: `pages/TaskDetail.jsx`, `services/index.js`

### Project Notes

- Create and manage project notes
- View note history
- Delete notes

**Files**: `pages/ProjectDetail.jsx`, `components/ui.jsx`

## 🎯 Code Organization & Maintainability

### Component Structure

- **Small, focused components**: Each component has a single responsibility
- **Props drilling**: Minimal; using Zustand for global state
- **Reusable UI components**: Located in `components/ui.jsx`
- **Page components**: Full-page components in `pages/` directory

### State Management

Files: `store/index.js`

Uses **Zustand** for simple, efficient state management:

- `useAuthStore`: Authentication state
- `useProjectStore`: Projects state
- `useTaskStore`: Tasks state
- `useNoteStore`: Notes state

### API Layer

Files: `services/api.js`, `services/index.js`

Organized endpoints:

- `authAPI`: Authentication endpoints
- `projectAPI`: Project endpoints
- `taskAPI`: Task and subtask endpoints
- `noteAPI`: Note endpoints

Auto-refresh tokens on 401 responses.

### Custom Hooks

Files: `hooks/index.js`

- `useForm`: Handle form state and submission
- `useAsync`: Handle async operations
- `useLocalStorage`: Persist data to localStorage

### Styling Strategy

Files: `styles/index.css`, `tailwind.config.js`

- **Tailwind CSS**: Utility-first CSS framework
- **Custom sketchy design**: Box shadows, borders, animations
- **Responsive**: Mobile-first approach
- **Dark mode ready**: Extensible theme system

## 🎨 Customization Guide

### Changing Colors

Edit `tailwind.config.js`:

```js
colors: {
  sketch: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#F59E0B',
    // ... more colors
  }
}
```

### Adding New Pages

1. Create component in `pages/` directory
2. Add route in `App.jsx`
3. Import and use in routing

Example:

```jsx
// In App.jsx
import MyNewPage from "./pages/MyNewPage";

<Route path="/my-page" element={<MyNewPage />} />;
```

### Extending UI Components

Edit `components/ui.jsx` to add new components following the existing pattern.

### Adding API Endpoints

Add to `services/index.js`:

```js
export const myAPI = {
  getAll: () => apiClient.get("/my-endpoint"),
  create: (data) => apiClient.post("/my-endpoint", data),
};
```

## 📱 Responsive Design

- **Mobile**: Full-width, stacked layout
- **Tablet**: 2-column grid for cards
- **Desktop**: 3-column grid, sidebar visible
- **Large**: Optimized spacing and font sizes

## ⚡ Performance Optimization

- Code splitting with React Router
- Lazy loading of components
- Memoization of expensive computations
- Efficient re-renders with Zustand

## 🔒 Security Features

- HTTP-only cookies for tokens
- CORS enabled
- Input validation on forms
- Protected routes
- Automatic token refresh
- Logged-out on token expiry

## 🧪 Testing

Currently, the project uses browser testing. To add unit tests:

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react
```

## 🚢 Deployment

### Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy!

### Deploy to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set environment variables
6. Deploy!

## 📦 Dependencies

### Core

- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Routing
- **zustand**: State management
- **axios**: HTTP client
- **react-toastify**: Toast notifications

### UI & Styling

- **tailwindcss**: Utility-first CSS
- **lucide-react**: Icon library

### Utilities

- **date-fns**: Date formatting
- **clsx**: Utility for classNames

## 🔗 API Base URL

Default: `http://localhost:8000/api/v1`

Change in `.env.local`:

```
VITE_API_URL=http://your-api-url/api/v1
```

## 📝 Logging

Currently using `console.log` for debugging. For production logging:

```bash
npm install --save-dev winston
```

## 🐛 Common Issues & Solutions

### CORS Errors

Check backend `.env` file has correct `CORS_ORIGIN` setting.

### 404 on page refresh

Check `vite.config.js` has proper routing configuration.

### Token not persisting

Ensure cookies are enabled and backend sets `httpOnly: true`.

### API not responding

Verify:

1. Backend is running on correct port
2. `VITE_API_URL` is correct
3. Network tab shows requests being made

## 📚 Resources

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com)
- [Vite](https://vitejs.dev)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit pull request

## 📄 License

ISC

## 👨‍💻 Author

Developed as part of Project Camp Backend integration

---

**Happy Coding! 🚀** Built with ❤️ using React and Tailwind CSS
