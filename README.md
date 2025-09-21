# Code Genie 🧞‍♂️

An intelligent AI-powered code generation application that transforms natural language descriptions into clean, functional code using Google's Gemini AI.

## 📋 Project Overview

Code Genie is a full-stack web application designed to help developers quickly generate code snippets by simply describing what they want to build in plain English. The application features a modern, ChatGPT-inspired user interface with powerful AI capabilities powered by Google's Gemini API.

## ✨ Key Features

### 🤖 **AI-Powered Code Generation**
- Utilizes Google Gemini Pro for high-quality code generation
- Supports 15+ programming languages (JavaScript, Python, Java, C++, TypeScript, Go, Rust, etc.)
- Intelligent language detection and auto-formatting
- Context-aware prompts for better code quality

### 🎨 **Modern User Interface**
- Clean, minimalist design inspired by ChatGPT
- Responsive design that works seamlessly on all devices
- Dark/Light mode toggle with smooth transitions
- Professional syntax highlighting with Prism.js
- Real-time code preview and formatting

### 🛠️ **Developer Experience**
- One-click copy to clipboard functionality
- Download generated code as properly formatted files
- Generation history with local storage (last 50 generations)
- Enter key support for quick code generation
- Language-specific file extensions for downloads

### 🚀 **Performance & Architecture**
- Built with modern React 18 + Vite for fast development and hot reload
- CSS Modules for scoped styling and better maintainability
- Express.js backend with proper error handling and validation
- RESTful API design with comprehensive error responses
- Optimized bundle size and lazy loading

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Framework**: React 18 with Vite
- **Styling**: CSS Modules with modern design patterns
- **Icons**: Lucide React for consistent iconography
- **Syntax Highlighting**: Prism.js with multiple themes
- **HTTP Client**: Axios with interceptors for error handling
- **Notifications**: React Hot Toast for user feedback

### **Backend Stack**
- **Runtime**: Node.js with Express.js framework
- **AI Integration**: Google Generative AI SDK (Gemini Pro)
- **Security**: Helmet.js for security headers, CORS configuration
- **Logging**: Morgan for request logging
- **Environment**: dotenv for configuration management

### **Development Tools**
- **Package Manager**: npm with workspace configuration
- **Development Server**: Nodemon for backend hot reload
- **Code Quality**: ES6+ modern JavaScript features
- **API Testing**: Built-in health check endpoints

## 🎯 Use Cases

### **For Developers**
- Quickly prototype functions and components
- Generate boilerplate code for common patterns
- Learn new programming languages through examples
- Create utility functions and helper methods
- Generate algorithm implementations

### **For Students**
- Learn programming concepts through AI-generated examples
- Understand best practices in different languages
- Get help with homework and projects
- Explore different approaches to problem-solving

### **For Teams**
- Standardize code patterns across projects
- Generate consistent documentation templates
- Create testing boilerplate and mock data
- Rapid prototyping for proof of concepts

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-genie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in backend directory
   cd backend
   cp .env.example .env
   ```
   
   Edit `backend/.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3002
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3002

## 🎨 Design Philosophy

### **User-Centric Design**
The interface is designed with simplicity and efficiency in mind, following modern web design principles:

- **Minimalist Layout**: Clean, uncluttered interface focusing on the core functionality
- **Intuitive Navigation**: Logical flow from input to output with clear visual hierarchy
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Accessibility**: Proper focus states, color contrast, and keyboard navigation

### **Performance First**
- Optimized bundle sizes with tree shaking
- Lazy loading of non-critical components
- Efficient API calls with proper error handling
- Local storage for user preferences and history

## 🔒 Security Features

- **API Key Protection**: Environment variables for sensitive configuration
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Security Headers**: Helmet.js for additional security layers
- **Error Handling**: Sanitized error messages without sensitive information

## 📊 API Documentation

### **Endpoints**

#### `POST /api/generate-code`
Generate code based on natural language description.

**Request Body:**
```json
{
  "prompt": "Create a function that validates email addresses",
  "language": "javascript",
  "includeComments": true
}
```

**Response:**
```json
{
  "success": true,
  "code": "function validateEmail(email) {...}",
  "language": "javascript",
  "prompt": "Create a function that validates email addresses",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### `GET /api/languages`
Get list of supported programming languages.

#### `GET /api/health`
Health check endpoint for monitoring.

## 🚀 Deployment

### **Production Environment**
1. Set `NODE_ENV=production` in environment variables
2. Configure production domain in CORS settings
3. Use process manager like PM2 for backend
4. Build frontend with `npm run build`
5. Serve static files with nginx or similar

### **Environment Variables**
```env
# Backend (.env)
GEMINI_API_KEY=your_production_api_key
PORT=3002
NODE_ENV=production

# Frontend (.env)
VITE_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### **Development Guidelines**
- Follow the existing code style and patterns
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

MIT License - feel free to use this project for learning, development, and commercial purposes.

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the powerful language model
- **React Team** for the excellent frontend framework
- **Vite** for the fast build tool and development server
- **Prism.js** for beautiful syntax highlighting
- **Lucide** for the clean and consistent icon set

---

**Built with ❤️ by the Code Genie Team**

*Transform your ideas into code with the power of AI* ✨