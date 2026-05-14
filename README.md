# Project Camp

A full-stack collaborative project management application designed for beginners and teams. Project Camp enables users to organize projects, manage tasks with subtasks, maintain project notes, and handle user authentication with role-based access control.

## 📸 Screenshots

<!-- Add your website screenshots here! Example format below: -->
<!-- ![Dashboard](/path/to/screenshot1.png) -->
<!-- ![Project View](/path/to/screenshot2.png) -->
<div align="center">
  <img src="D:\PMP\public\images\image.png" alt="Project Camp Screenshot" width="800"/>
</div>

## 🚀 Features

### User Authentication & Authorization
*   Secure user registration with email verification.
*   JWT-based authentication with refresh tokens.
*   Password management (change password, forgot/reset password).
*   Role-Based Access Control (Admin, Project Admin, Member).

### Project Management
*   Create, view, update, and delete projects.
*   Track project members and their roles.

### Team Member Management
*   Invite members via email to collaborate on projects.
*   Manage member roles within specific projects.
*   Remove members when necessary.

### Task & Subtask Management
*   Create tasks with titles, descriptions, and assignees.
*   Organize task states (Todo, In Progress, Done).
*   Support for multiple file attachments on tasks.
*   Break down tasks into manageable subtasks.

### Project Notes
*   Add and manage shared notes for projects to keep track of important information.

## 💻 Tech Stack

### Frontend
*   **Framework:** React 18 (with Vite)
*   **State Management:** Zustand, React Query
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **Icons:** Lucide React

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose
*   **Authentication:** JSON Web Tokens (JWT), bcrypt
*   **File Uploads:** Multer
*   **Email Services:** Nodemailer, Mailgen

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

## 📦 Installation & Setup

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd PMP
    ```

2.  **Backend Setup:**
    *   Install backend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the root directory and configure the necessary environment variables (Database URI, JWT Secrets, SMTP credentials, etc.).
    *   Start the backend development server:
        ```bash
        npm run dev
        ```
        The API will be available at `http://localhost:<PORT>`.

3.  **Frontend Setup:**
    *   Open a new terminal window and navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    *   Install frontend dependencies:
        ```bash
        npm install
        ```
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
        The application will be accessible at the local Vite server URL (typically `http://localhost:5173`).

## 🔗 Core API Endpoints

*   **Auth:** `/api/v1/auth/*` (Register, Login, Password Reset, etc.)
*   **Projects:** `/api/v1/projects/*` (CRUD operations for projects and members)
*   **Tasks:** `/api/v1/tasks/*` (CRUD operations for tasks and subtasks)
*   **Notes:** `/api/v1/notes/*` (CRUD operations for project notes)
*   **Health:** `/api/v1/healthcheck/`

For detailed API specifications and payload structures, refer to the [PRD.md](./prd.md) file.

## 👤 Author

**Deebyanshu Jha**

## 📄 License

This project is licensed under the ISC License.
