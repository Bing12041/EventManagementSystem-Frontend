# Event Management System - Frontend

Welcome to the Event Management System frontend repository. This project provides a user interface for managing events, including browsing, creation, and interaction through location services and RSVPs.

## Overview

This application uses React with TypeScript for creating an interactive and responsive user interface. Here's a brief overview of the key functionalities:

- **User Authentication**: Users can register and log in to access personalized features.
- **Event Management**: Users can create, view, update, delete events, with options to filter by category, date, or location.
- **RSVP System**: Allows users to RSVP to events.
- **Location Integration**: Uses Google Maps API for location-based services.

## Tech Stack

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks with Redux for global state
- **Routing**: React Router for navigation
- **API Communication**: Axios for HTTP requests
- **Authentication**: Microsoft Authentication Library (MSAL) for Azure AD integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Steps to Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/EventManagementSystem-Frontend.git
   cd EventManagementSystem-Frontend
   ```

## Project Structure
- src/
  - components/: Contains reusable UI components
  - hooks/: Custom React hooks for state management
  - pages/: Route-specific components (e.g., Home, Login, EventList)
  - services/: API service calls
  - utils/: Utility functions and types
  - assets/: Static files like images, styles, and fonts
- public/: Public assets like the favicon and index.html
- package.json: Project dependencies and scripts