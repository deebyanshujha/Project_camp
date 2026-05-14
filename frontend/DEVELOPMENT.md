<!-- ProjectCamp Frontend - Setup & Development Guide -->

# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js v16+ installed
- [ ] Backend running on http://localhost:8000
- [ ] npm or yarn available

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local if needed (default should work for local dev)
# VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

**Access at**: http://localhost:5173

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter (if configured)
npm run lint
```

## Folder Navigation

### Adding a New Feature

1. **Create API endpoint** → `services/index.js`

   ```js
   export const myFeatureAPI = {
     getAll: () => apiClient.get("/my-feature"),
   };
   ```

2. **Create state store** → `store/index.js`

   ```js
   export const useMyFeatureStore = create((set) => ({
     items: [],
     setItems: (items) => set({ items }),
   }));
   ```

3. **Create page component** → `pages/MyFeature.jsx`

   ```jsx
   export default function MyFeature() {
     const { items } = useMyFeatureStore();
     return <div>...</div>;
   }
   ```

4. **Add route** → `App.jsx`
   ```jsx
   <Route path="/my-feature" element={<MyFeature />} />
   ```

### Adding a UI Component

All reusable UI components go in `components/ui.jsx`:

```jsx
export function MyComponent({ children, variant = "primary" }) {
  return <div className="my-component">{children}</div>;
}
```

Then import and use:

```jsx
import { MyComponent } from "../components/ui";
```

## Common Development Tasks

### Styling a Component

- Use Tailwind classes first
- Add custom CSS in `src/styles/index.css` if needed
- Use custom sketchy colors: `sketch-primary`, `sketch-secondary`, etc.

### Handling Forms

Use the `useForm` hook:

```jsx
const { values, handleChange, handleSubmit, isSubmitting } = useForm(
  { name: "" },
  async (data) => {
    // Handle submission
  },
);
```

### Making API Calls

```jsx
import { myFeatureAPI } from "../services";

const data = await myFeatureAPI.getAll();
```

### State Management

```jsx
import { useMyFeatureStore } from "../store";

const { items, setItems } = useMyFeatureStore();
```

## Browser DevTools

### React Developer Tools

Install: [React DevTools Extension](https://chrome.google.com/webstore/detail/react-developer-tools/)

Uses:

- Inspect component hierarchy
- Check props and state
- Track re-renders

## Debugging Tips

### Console Logging

```jsx
console.log("Debug info:", data);
```

### Network Requests

1. Open DevTools → Network tab
2. Check API calls
3. Verify status codes and responses

### Redux DevTools (Alternative)

If using Redux instead of Zustand, install Redux DevTools.

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

## Performance Monitoring

### Check Chrome DevTools

- Lighthouse tab for performance score
- Performance tab for runtime metrics
- Memory tab for memory leaks

### Key Metrics

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

## Testing Locally

### Test Different Screen Sizes

Use Chrome DevTools → Device Toolbar (Ctrl+Shift+M)

### Test Different Browsers

- Chrome, Firefox, Safari, Edge

### Test Different Network Speeds

Chrome DevTools → Network tab → Throttling

## Environment Setup

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)

### Configuration

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Troubleshooting

### Port 5173 Already in Use

```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows
```

### Modules Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Hot Reload Not Working

```bash
# Restart dev server
npm run dev
```

### API Connection Fails

- Check backend is running: `curl http://localhost:8000/api/v1/healthCheck/`
- Verify `VITE_API_URL` in `.env.local`
- Check CORS settings in backend

## Production Checklist

- [ ] Build passes: `npm run build`
- [ ] All console errors fixed
- [ ] Environment variables configured
- [ ] API endpoints correct
- [ ] Images optimized
- [ ] No console.log left in production code
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] CDN configured (if using)

## Resources for Learning

- React: https://react.dev/learn
- Tailwind: https://tailwindcss.com/docs
- Vite: https://vitejs.dev/guide/
- Zustand: https://github.com/pmndrs/zustand

---

**Happy Developing! 🚀**
