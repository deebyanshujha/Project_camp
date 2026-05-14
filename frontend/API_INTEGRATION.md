# Frontend-Backend Integration Guide

## Overview

This document details how the frontend integrates with the ProjectCamp backend API.

## API Integration Layer

### Request Flow

```
Component → Zustand Store → API Service → Axios Client → Backend
```

### Response Flow

```
Backend → Axios Interceptor → API Service → Zustand Store → Component → UI Update
```

## Authentication Flow

### Login

```
1. User submits login form
2. authAPI.login() sends credentials
3. Backend returns: { user, accessToken, refreshToken }
4. Tokens stored in localStorage
5. accessToken added to Authorization header
6. User redirected to dashboard
```

### Token Refresh

```
1. API call fails with 401
2. Axios interceptor catches error
3. refreshToken used to get new accessToken
4. Original request retried
5. If refresh fails, user logged out
```

### Logout

```
1. authAPI.logout() called
2. Tokens cleared from localStorage
3. User redirected to login
```

## API Endpoints Reference

### Auth Group: `/api/v1/auth/`

| Method | Endpoint                     | Purpose                   | Auth Required |
| ------ | ---------------------------- | ------------------------- | ------------- |
| POST   | `/register`                  | Create new user           | No            |
| POST   | `/login`                     | User authentication       | No            |
| POST   | `/logout`                    | Logout user               | Yes           |
| GET    | `/current-user`              | Get current user info     | Yes           |
| POST   | `/change-password`           | Change password           | Yes           |
| POST   | `/refresh-token`             | Refresh access token      | No            |
| GET    | `/verify-email/:token`       | Verify email              | No            |
| POST   | `/forgot-password`           | Request password reset    | No            |
| POST   | `/reset-password/:token`     | Reset forgotten password  | No            |
| POST   | `/resend-email-verification` | Resend verification email | Yes           |

### Projects Group: `/api/v1/projects/`

| Method | Endpoint                      | Purpose              | Auth Required | Roles |
| ------ | ----------------------------- | -------------------- | ------------- | ----- |
| GET    | `/`                           | List all projects    | Yes           | All   |
| POST   | `/`                           | Create new project   | Yes           | admin |
| GET    | `/:projectId`                 | Get project details  | Yes           | All   |
| PUT    | `/:projectId`                 | Update project       | Yes           | admin |
| DELETE | `/:projectId`                 | Delete project       | Yes           | admin |
| GET    | `/:projectId/members`         | List project members | Yes           | All   |
| POST   | `/:projectId/members`         | Add project member   | Yes           | admin |
| PUT    | `/:projectId/members/:userId` | Update member role   | Yes           | admin |
| DELETE | `/:projectId/members/:userId` | Remove member        | Yes           | admin |

### Tasks Group: `/api/v1/tasks/`

| Method | Endpoint                         | Purpose            | Auth Required | Roles                |
| ------ | -------------------------------- | ------------------ | ------------- | -------------------- |
| GET    | `/:projectId`                    | List project tasks | Yes           | All                  |
| POST   | `/:projectId`                    | Create task        | Yes           | admin, project_admin |
| GET    | `/:projectId/t/:taskId`          | Get task details   | Yes           | All                  |
| PUT    | `/:projectId/t/:taskId`          | Update task        | Yes           | admin, project_admin |
| DELETE | `/:projectId/t/:taskId`          | Delete task        | Yes           | admin, project_admin |
| POST   | `/:projectId/t/:taskId/subtasks` | Create subtask     | Yes           | admin, project_admin |
| PUT    | `/:projectId/st/:subTaskId`      | Update subtask     | Yes           | All                  |
| DELETE | `/:projectId/st/:subTaskId`      | Delete subtask     | Yes           | admin, project_admin |

### Notes Group: `/api/v1/notes/`

| Method | Endpoint                | Purpose            | Auth Required | Roles |
| ------ | ----------------------- | ------------------ | ------------- | ----- |
| GET    | `/:projectId`           | List project notes | Yes           | All   |
| POST   | `/:projectId`           | Create note        | Yes           | admin |
| GET    | `/:projectId/n/:noteId` | Get note details   | Yes           | All   |
| PUT    | `/:projectId/n/:noteId` | Update note        | Yes           | admin |
| DELETE | `/:projectId/n/:noteId` | Delete note        | Yes           | admin |

## Request/Response Examples

### Login Request

```javascript
// Request
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

// Response (200 OK)
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "123abc",
      "username": "johndoe",
      "email": "user@example.com",
      "isEmailVerified": true,
      "role": "member"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User loggedin successfully"
}
```

### Create Project Request

```javascript
// Request
POST /api/v1/projects/
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "My New Project",
  "description": "Project description"
}

// Response (201 Created)
{
  "statusCode": 201,
  "data": {
    "_id": "proj123",
    "name": "My New Project",
    "description": "Project description",
    "createdBy": "123abc",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Project created successfully"
}
```

### Create Task Request

```javascript
// Request
POST /api/v1/tasks/proj123
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Implement login",
  "description": "Create login page",
  "assignedTo": "user456",
  "status": "todo"
}

// Response (201 Created)
{
  "statusCode": 201,
  "data": {
    "_id": "task123",
    "title": "Implement login",
    "description": "Create login page",
    "project": "proj123",
    "assignedTo": {
      "_id": "user456",
      "username": "alice"
    },
    "assignedBy": "123abc",
    "status": "todo",
    "attachment": [],
    "subtasks": [],
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Task created successfully"
}
```

## Error Handling

### Error Response Format

```json
{
  "statusCode": 400,
  "data": [],
  "message": "Error description"
}
```

### Common Error Codes

| Code | Meaning      | Handling                                 |
| ---- | ------------ | ---------------------------------------- |
| 400  | Bad Request  | Validate input, show form errors         |
| 401  | Unauthorized | Refresh token or redirect to login       |
| 403  | Forbidden    | Show permission denied message           |
| 404  | Not Found    | Show not found page                      |
| 409  | Conflict     | Handle duplicate (username/email exists) |
| 500  | Server Error | Show generic error message               |

## Frontend Error Handling Example

```javascript
try {
  const response = await projectAPI.createProject(data);
  setProjects([...projects, response.data.data]);
  toast.success("Project created!");
} catch (error) {
  const message = error.response?.data?.message || "Failed to create project";

  if (error.response?.status === 401) {
    // Handle unauthorized
    navigate("/login");
  } else if (error.response?.status === 409) {
    // Handle conflict (e.g., project name exists)
    setFieldError("name", "Project name already exists");
  } else {
    // Generic error
    toast.error(message);
  }
}
```

## State Management

### How Data Flows

```
1. Component loads (useEffect)
2. Calls API service
3. Updates Zustand store
4. Store triggers component re-render
5. Component displays data
```

### Example Flow

```jsx
// Page loads
useEffect(() => {
  fetchProjectData();
}, [projectId]);

// Fetch function
const fetchProjectData = async () => {
  const response = await projectAPI.getProjectById(projectId);
  setCurrentProject(response.data.data); // Update store
};

// Store state flows to component
const { currentProject } = useProjectStore();

// Render
return <div>{currentProject?.name}</div>;
```

## File Upload Handling

### Current Implementation

Files are stored in backend as URLs. The frontend sends file path:

```javascript
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("/api/v1/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data.url;
};
```

Then attach URL to task:

```javascript
await taskAPI.updateTask(projectId, taskId, {
  attachment: [...attachments, { url, mimeType, size }],
});
```

## Pagination (If Implemented)

Future enhancement for large lists:

```javascript
// API call with pagination
const getProjects = (page = 1, limit = 10) =>
  apiClient.get(`/projects/?page=${page}&limit=${limit}`);

// Response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Real-time Updates (Future)

Consider WebSocket integration for:

- Live task updates
- Notification system
- Collaborative editing

## Performance Tips

1. **Use React Query** (optional upgrade)
   - Automatic caching
   - Background refetching
   - Pagination support

2. **Implement virtualization** for large lists
   - Use `react-window` or `react-virtualized`

3. **Code splitting**
   - Already implemented with React Router
   - Components lazy load on route change

4. **Image optimization**
   - Use WebP format where possible
   - Compress images before upload

## Security Considerations

1. **Token Storage**: Currently in localStorage
   - Alternative: httpOnly cookies (backend-side)

2. **CORS**: Configured in backend
   - Frontend respects server settings

3. **Sensitive Data**: Passwords never stored in localStorage

4. **XSS Protection**: React automatically escapes by default

## Testing API Integration

### Using Thunder Client or Postman

1. **Set base URL**: `http://localhost:8000/api/v1`

2. **Set token in headers**:

   ```
   Authorization: Bearer {accessToken}
   ```

3. **Test endpoints** with different methods

### Frontend Testing

```javascript
// Test authentication flow
const testLogin = async () => {
  const response = await authAPI.login({
    email: "test@example.com",
    password: "password",
  });
  console.log("Login successful:", response.data);
};
```

## Debugging Tips

### Check Network Requests

- Open DevTools → Network tab
- Filter by XHR
- Check request/response bodies

### Check Store State

- Install Redux DevTools
- View store changes in real-time

### API Mock Server (for testing)

- Use `json-server` for mock API
- Or use API mocking library like `MSW`

## Updating Service Layer

When backend adds new endpoints:

1. Add to `services/index.js`:

```javascript
export const featureAPI = {
  getAll: () => apiClient.get("/feature"),
  create: (data) => apiClient.post("/feature", data),
};
```

2. Use in component:

```javascript
import { featureAPI } from "../services";

const data = await featureAPI.getAll();
```

---

For more details, check the backend PRD: [Backend Documentation](../prd.md)
