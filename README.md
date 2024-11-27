# Full-Stack Web Application

This is a full-stack web application with a React frontend and a FastAPI backend. The application includes user authentication, a dashboard, and other essential features.

## Table of Contents

- [Full-Stack Web Application](#full-stack-web-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Clone the Repository](#clone-the-repository)
    - [Backend Dependencies](#backend-dependencies)
    - [Frontend Dependencies](#frontend-dependencies)
  - [Configuration](#configuration)
    - [Backend Configuration](#backend-configuration)
    - [Frontend Configuration](#frontend-configuration)
  - [Running the Application](#running-the-application)
    - [Running the Backend](#running-the-backend)
    - [Running the Frontend](#running-the-frontend)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)

## Features

- User registration and authentication
- Protected routes and components
- Admin user creation on startup
- JSON Web Token (JWT) authentication
- Password hashing with bcrypt
- React Router for client-side routing
- Material UI components

## Prerequisites

- [Python 3.x](https://www.python.org/downloads/)
- [Node.js and npm](https://nodejs.org/en/download/)
- [Uvicorn](https://www.uvicorn.org/) (for running the FastAPI server)
- [Git](https://git-scm.com/downloads) (optional, for version control)

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```

### Backend Dependencies

Navigate to the `backend` directory and install the required Python packages:

```bash
cd backend
pip install -r requirements.txt
```

### Frontend Dependencies

Navigate to the `frontend` directory and install the required npm packages:

```bash
cd ../frontend
npm install
```

## Configuration

### Backend Configuration

The `backend/config.py` file contains configuration settings for the backend application. Update the following variables as needed:

- `ADMIN_EMAIL`: The email address for the default admin user.
- `ADMIN_PASSWORD`: The password for the default admin user.
- `APP_URL`: The URL of your frontend application (e.g., `http://localhost:3000`).
- `SECRET_KEY`: A secret key used for JWT encoding. Replace `"your-secret-key"` with a secure, randomly-generated string.
- `EMAIL_SENDER`, `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`: Email settings for password reset functionality. Update these if you enable password reset.

### Frontend Configuration

The `frontend/src/config.js` file contains configuration settings for the frontend application. Update the `API_BASE_URL` as needed:

```javascript
const CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:8001',
  },
  // ... other environments
};
```

## Running the Application

### Running the Backend

Navigate to the `backend` directory and start the FastAPI server using Uvicorn:

```bash
cd backend
bash ../scripts/start_backend.sh
```

Alternatively, you can run the server directly:

```bash
uvicorn backend.main:app --reload --port 8001
```

The backend server will start on `http://localhost:8001`.

### Running the Frontend

Navigate to the `frontend` directory and start the React application:

```bash
cd frontend
bash ../scripts/start_frontend.sh
```

Alternatively, you can start the app directly:

```bash
npm start
```

The frontend application will start on `http://localhost:3000`.

## Project Structure

```
yourproject/
├── backend/
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── users.py
│   ├── schemas.py
│   ├── send_email.py
│   ├── utils.py
│   ├── requirements.txt
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Logout.js
│   │   │   ├── RedirectToDashboard.js
│   │   │   └── SignUp.js
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── config.js
│   │   └── reportWebVitals.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
├── scripts/
│   ├── start_backend.sh
│   └── start_frontend.sh
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

