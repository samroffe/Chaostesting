# Chaos Engineering Tool - Frontend

This is the React-based frontend for the Chaos Engineering Tool, built with Vite.js.

## Overview

The Chaos Engineering Tool provides a web-based interface for managing and executing chaos experiments across servers and containers. It allows for systematic testing of infrastructure resilience through controlled disruption experiments.

## Features

- Server management through SSH
- Docker container management
- Experiment scheduling and execution
- Reports and analytics
- Dark-themed responsive design

## Tech Stack

- **React** - Frontend library
- **Vite.js** - Build tool and development server
- **React Router** - For application routing
- **Bootstrap** with Replit dark theme - For UI components and styling
- **Font Awesome** - For icons
- **Axios** - For API requests
- **Chart.js** - For data visualization

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images, CSS, etc.
│   ├── components/   # Reusable React components
│   │   ├── common/   # Common UI components
│   │   ├── dashboard/# Dashboard-specific components
│   │   ├── servers/  # Server management components
│   │   └── ...       # Other component categories
│   ├── pages/        # Top-level page components
│   ├── utils/        # Utility functions
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Application entry point
├── index.html        # HTML template
└── vite.config.js    # Vite configuration
```