# Component Architecture

## Overview

This guide explains the component structure for easy maintenance and scalability.

## Component Categories

### Layout Components

Located in `components/`

#### Layout.jsx

- Main layout wrapper for authenticated routes
- Contains Sidebar and Route outlet
- Manages sidebar toggle state

#### Navbar.jsx

- Top navigation bar
- Shows user info and logout button
- Menu toggle for sidebar

#### Sidebar.jsx

- Left side navigation menu
- Responsive (collapsible on mobile)
- Active route highlighting

### UI Components

Located in `components/ui.jsx`

#### Button

```jsx
<Button variant="primary" size="md" onClick={...}>
  Click me
</Button>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean

#### Input

```jsx
<Input
  label="Email"
  name="email"
  placeholder="your@email.com"
  error={error}
  value={value}
  onChange={handleChange}
/>
```

**Props:**

- `label`: string
- `error`: string (error message)
- `helperText`: string
- `className`: string

#### Textarea

```jsx
<Textarea
  label="Description"
  name="description"
  placeholder="Enter description"
  value={value}
  onChange={handleChange}
/>
```

#### Card

```jsx
<Card className="p-6">Content here</Card>
```

Reusable sketchy card component for consistent styling.

#### Badge

```jsx
<Badge variant="primary">Active</Badge>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'success' | 'error'

#### Modal

```jsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Dialog Title">
  Content here
</Modal>
```

#### Select

```jsx
<Select
  label="Choose"
  name="choice"
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
  value={value}
  onChange={handleChange}
/>
```

## Page Components

Located in `pages/`

### Authentication Pages

- **Login.jsx**: User login
- **Register.jsx**: User registration
- **VerifyEmail.jsx**: Email verification
- **ForgotPassword.jsx**: Password reset request
- **ResetPassword.jsx**: Password reset form
- **NotFound.jsx**: 404 page

### Main Application Pages

- **Dashboard.jsx**: Home/dashboard view
- **ProjectList.jsx**: All projects
- **ProjectDetail.jsx**: Single project view with tasks, notes, members
- **TaskDetail.jsx**: Single task view with subtasks

## Custom Hooks

Located in `hooks/index.js`

### useForm

Form state management with validation support.

```jsx
const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
  { name: "", email: "" },
  async (formData) => {
    // Handle submission
  },
);
```

### useAsync

Handle async operations with loading/error states.

```jsx
const { execute, status, data, error } = useAsync(asyncFunction);

// Call when needed
await execute(param1, param2);
```

### useLocalStorage

Persist data to localStorage.

```jsx
const [value, setValue] = useLocalStorage("key", "defaultValue");
```

## Store Architecture (Zustand)

Located in `store/index.js`

### useAuthStore

```jsx
const { user, isAuthenticated, login, logout, getCurrentUser } = useAuthStore();
```

### useProjectStore

```jsx
const {
  projects,
  currentProject,
  setProjects,
  addProject,
  updateProject,
  removeProject,
} = useProjectStore();
```

### useTaskStore

Similar structure to useProjectStore.

### useNoteStore

Similar structure to useProjectStore.

## Creating New Components

### Step-by-Step Guide

#### 1. Create a new UI Component

File: `components/ui.jsx`

```jsx
export function MyComponent({ children, variant = "default" }) {
  return (
    <div
      className={cn("my-component", variant === "special" && "special-variant")}
    >
      {children}
    </div>
  );
}
```

#### 2. Create a new Page Component

File: `pages/MyPage.jsx`

```jsx
import { useState, useEffect } from "react";
import { Card, Button } from "../components/ui";
import { useMyStore } from "../store";

export default function MyPage() {
  const { data, loading } = useMyStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load data
  }, []);

  return <div className="space-y-8">{/* Content */}</div>;
}
```

#### 3. Add to Routes

File: `App.jsx`

```jsx
import MyPage from "./pages/MyPage";

// In Routes component
<Route path="/my-page" element={<MyPage />} />;
```

#### 4. Add to Navigation

File: `components/Sidebar.jsx`

```jsx
const menuItems = [
  { label: "My Page", icon: Icon, href: "/my-page" },
  // ...
];
```

## Component Composition Pattern

### Example: Task Card Component

```jsx
export function TaskCard({ task, onEdit, onDelete }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="text-gray-600 text-sm mt-2">{task.description}</p>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
```

Usage:

```jsx
<TaskCard
  task={task}
  onEdit={() => handleEdit(task._id)}
  onDelete={() => handleDelete(task._id)}
/>
```

## Styling Best Practices

### Use Tailwind Classes

```jsx
className = "flex justify-between items-center gap-4 p-6 rounded-lg";
```

### Use Custom sketchy styles

```jsx
className = "sketch-card sketch-btn";
```

### Use cn() for conditional classes

```jsx
import { cn } from '../utils/helpers';

className={cn(
  'base-classes',
  isActive && 'active-classes'
)}
```

## Props Patterns

### Standard Props

```jsx
{
  loading: boolean,
  error: string | null,
  data: T,
  onSuccess: () => void,
  onError: (error) => void
}
```

### Consistent Naming

- `onSomething` for callbacks
- `isSomething` for booleans
- `hasSomething` for presence checks
- `canSomething` for ability checks

## Error Boundaries (Future Enhancement)

```jsx
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }

    return this.props.children;
  }
}
```

## Component Testing Checklist

When creating new components:

- [ ] Props are documented
- [ ] Default values provided
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Responsive design tested
- [ ] Keyboard accessible
- [ ] No console errors/warnings

## Performance Optimization

### Memoization

```jsx
import { memo } from "react";

const MyComponent = memo(function MyComponent({ data }) {
  return <div>{data}</div>;
});
```

### Lazy Loading

```jsx
import { lazy, Suspense } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>;
```

## File Organization Summary

```
src/
├── components/
│   ├── index.js          # Export all components
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   └── ui.jsx            # All UI components
│
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── ProjectDetail.jsx
│   └── ...more pages
│
├── hooks/
│   └── index.js          # All custom hooks
│
├── store/
│   └── index.js          # All Zustand stores
│
├── services/
│   ├── api.js            # Axios config
│   └── index.js          # API endpoints
│
├── utils/
│   └── helpers.js        # Utility functions
│
├── styles/
│   └── index.css         # Global styles
│
├── App.jsx               # Routes
└── main.jsx              # Entry point
```

---

**Key Principles:**

- Keep components small and focused
- Reuse UI components from `ui.jsx`
- Use Zustand for global state
- Use hooks for local state and effects
- Follow naming conventions
- Document complex components
