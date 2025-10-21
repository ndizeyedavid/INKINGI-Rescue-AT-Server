# Contributing to INKINGI Rescue

Thank you for your interest in contributing to INKINGI Rescue! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Adding Features](#adding-features)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a `.env.local` file based on `.env.example`
5. Start the development server: `npm start`

## Project Structure

```
src/
├── config/           # Configuration files (menus, constants)
├── controllers/      # Business logic and request handlers
├── middlewares/      # Express middleware functions
├── routers/          # Route definitions
├── utils/            # Utility functions and helpers
├── locales/          # Internationalization files
└── server.js         # Application entry point
```

### Directory Responsibilities

- **config/**: Store all configuration data (USSD menus, constants, settings)
- **controllers/**: Handle business logic, process requests, interact with services
- **middlewares/**: Request/response processing, authentication, logging, error handling
- **routers/**: Define API routes and map them to controllers
- **utils/**: Reusable helper functions (session management, validators, formatters)
- **locales/**: Translation files for multi-language support

## Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes** thoroughly

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** from your fork to the main repository

## Code Style Guidelines

### General Rules

- Use ES6+ features (arrow functions, destructuring, template literals)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused (single responsibility)
- Use async/await instead of callbacks

### File Naming

- Use camelCase for file names: `ussdController.js`, `sessionManager.js`
- Use PascalCase for class names
- Use UPPER_CASE for constants

### Code Formatting

```javascript
// ✅ Good
export const handleEmergency = async (userData) => {
  const { sessionId, phoneNumber } = userData;

  try {
    const result = await saveEmergency(userData);
    return `END Emergency reported successfully!`;
  } catch (error) {
    console.error("Error saving emergency:", error);
    return `END An error occurred. Please try again.`;
  }
};

// ❌ Bad
export const handleEmergency = (userData) => {
  return `END Emergency reported!`;
};
```

## ✨ Adding Features

### Adding a New USSD Menu

1. **Edit `src/config/ussdMenus.js`**:

```javascript
export const ussdMenus = {
  // ... existing menus
  yourNewMenu: {
    text: `CON Your menu title
    1. Option 1
    2. Option 2
    0. Go back`,
    options: {
      1: "nextScreen1",
      2: "nextScreen2",
      0: "previousScreen",
    },
  },
};
```

2. **Link it from an existing menu** by updating the parent menu's options

### Adding a Terminal Handler

1. **Edit `src/controllers/ussdController.js`**:

```javascript
export const terminalHandlers = {
  // ... existing handlers
  yourHandler: (userData) => {
    // Your business logic here
    // Call external APIs, save to database, etc.
    return `END Your response message`;
  },
};
```

### Adding a New Controller

1. **Create `src/controllers/yourController.js`**:

```javascript
export const yourFunction = async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

2. **Create a router in `src/routers/yourRouter.js`**:

```javascript
import express from "express";
import { yourFunction } from "../controllers/yourController.js";

const router = express.Router();
router.post("/your-endpoint", yourFunction);

export default router;
```

3. **Register the router in `src/server.js`**:

```javascript
import yourRouter from "./routers/yourRouter.js";
app.use("/api", yourRouter);
```

### Adding Middleware

1. **Create `src/middlewares/yourMiddleware.js`**:

```javascript
export const yourMiddleware = (req, res, next) => {
  // Your middleware logic
  next();
};
```

2. **Register in `src/server.js`**:

```javascript
import { yourMiddleware } from "./middlewares/yourMiddleware.js";
app.use(yourMiddleware);
```

## Testing

### Manual Testing

1. Use the Africa's Talking USSD Simulator: https://simulator.africastalking.com/
2. Test all menu flows
3. Test error scenarios
4. Test with different phone numbers

### Testing Checklist

- [ ] All menu options work correctly
- [ ] "Go back" (0) navigation works
- [ ] Invalid inputs are handled gracefully
- [ ] Terminal responses end with "END"
- [ ] Continuation responses start with "CON"
- [ ] Session data persists correctly
- [ ] Language switching works

## Pull Request Process

1. **Update documentation** if you've added new features
2. **Ensure your code follows** the style guidelines
3. **Test thoroughly** before submitting
4. **Write a clear PR description**:

   ```
   ## Description
   Brief description of what this PR does

   ## Changes
   - Added feature X
   - Fixed bug Y
   - Updated documentation

   ## Testing
   How to test these changes

   ## Screenshots (if applicable)
   ```

5. **Link related issues** using keywords like "Fixes #123"

## Reporting Bugs

When reporting bugs, include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or logs (if applicable)
- Your environment (OS, Node version, etc.)

## Suggesting Features

When suggesting features:

- Describe the feature clearly
- Explain the use case
- Provide examples if possible
- Consider how it fits into the existing architecture

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be respectful and constructive in discussions

## Priority Areas

We're especially interested in contributions for:

- Multi-language support (translations)
- Emergency response automation
- UI/UX improvements for USSD menus

Thank you for contributing to INKINGI Rescue!
