# Developer Shohag Portfolio

A modern full-stack developer portfolio with a CMS dashboard for managing projects, blogs, FAQs, and portfolio content.

Shohag Portfolio is a full-stack personal portfolio platform built with React, Node.js, Express, and MongoDB. It includes a public portfolio website and an admin dashboard for managing projects, blogs, FAQs, and other portfolio content.


## Live Demo

🌐 [View Portfolio](https://your-domain.com)

🛠️ [Admin Dashboard](https://your-dashboard-domain.com)

## Features

- Responsive personal portfolio
- Dark and light theme
- Project showcase
- Blog management
- FAQ management
- Admin dashboard
- Authentication and authorization
- Role-based access control
- Image upload
- CRUD operations
- RESTful API
- Form validation
- Error handling

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Redux Toolkit
- RTK Query
- Axios
- React Hook Form
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser

### Tools

- Git
- GitHub
- Vite
- VS Code

## Architecture

The application is divided into three major parts:

```text
                    ┌──────────────────┐
                    │   Public Client  │
                    │     React        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    REST API      │
                    │ Express / Node   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     MongoDB      │
                    └──────────────────┘

                    ┌──────────────────┐
                    │   Admin Dashboard│
                    │ React + Redux    │
                    └────────┬─────────┘
                             │
                             └──────► REST API