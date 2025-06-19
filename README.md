"# Project Management Application (PPFin)

A comprehensive project management application built with React and Node.js, designed to streamline team collaboration, task management, and project tracking.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/signup with JWT tokens
- **Project Management** - Create, track, and manage projects with detailed information
- **Task Management** - Assign tasks to team members with priority levels and deadlines
- **Team Management** - Organize teams, manage employees, and track team performance
- **Client Management** - Maintain client information and project associations
- **Invoice Management** - Generate and manage invoices for projects
- **Real-time Chat** - Built-in messaging system for team communication
- **Document Management** - Upload, organize, and share project documents
- **Notes System** - Create and manage project notes with markdown support
- **Interactive Whiteboard** - Collaborative whiteboard for brainstorming sessions
- **Daily Feedback** - Track daily progress and team feedback
- **Dashboard Analytics** - Visual insights with charts and statistics
- **Media Recording** - Record audio/video for project documentation

### Technical Features
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Real-time Updates** - Live updates for chat and notifications
- **File Upload** - Support for document and media file uploads
- **Search Functionality** - Search across notes, documents, and projects
- **Data Visualization** - Charts and graphs using Recharts library
- **Security** - Helmet.js for security headers, rate limiting, and input validation

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization library
- **Lucide React** - Modern icon library
- **React Toastify** - Toast notifications
- **React Webcam** - Camera integration
- **React Media Recorder** - Audio/video recording
- **Day.js** - Date manipulation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation
- **Express Rate Limit** - Rate limiting middleware
- **Socket.io Client** - Real-time communication
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
ppfin/ppOrigine/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/              # Business logic controllers
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── employeeController.js
│   │   └── ...
│   ├── models/                   # Database models
│   │   ├── Client.js
│   │   ├── Employee.js
│   │   ├── Task.js
│   │   ├── project.js
│   │   └── ...
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── projectRoutes.js
│   │   └── ...
│   ├── middleware/               # Custom middleware
│   │   └── authMiddleware.js
│   ├── data/                     # JSON data storage
│   │   ├── notes.json
│   │   └── documents.json
│   ├── app.js                    # Main application file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── Admindash.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── ...
│   │   ├── assets/              # Static assets
│   │   ├── App.jsx              # Main App component
│   │   └── main.jsx             # Entry point
│   ├── public/                  # Public assets
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ppfin/ppOrigine
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Setup**
   - Create a MySQL database
   - Update the `.env` file in the backend directory with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the Application**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Teams & Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team

### Documents & Notes
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Upload document
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note

### Chat
- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/messages` - Send message

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Follow React best practices and hooks patterns

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet.js
- SQL injection prevention

## 🚀 Deployment

### Production Build
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Configure environment variables for production
3. Set up MySQL database
4. Deploy backend to your preferred hosting service
5. Deploy frontend build files to a web server

### Environment Variables
Create a `.env` file in the backend directory:
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name
JWT_SECRET=your_strong_jwt_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

- **Project Type**: Project Management Application
- **Architecture**: Full-stack web application
- **Database**: MySQL with JSON file storage for certain features

## 🐛 Known Issues

- Chat messages are stored in memory (consider implementing database storage for production)
- File upload functionality may need additional configuration for large files
- Real-time features may require WebSocket implementation for better performance

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] Integration with third-party tools (Slack, Trello, etc.)
- [ ] Advanced file management with cloud storage
- [ ] Time tracking functionality
- [ ] Gantt chart visualization
- [ ] Email notifications
- [ ] Advanced user roles and permissions

## 📞 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using React and Node.js**"
