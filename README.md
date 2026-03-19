# LUXE E-Commerce Web Application

LUXE is a modern e-commerce frontend application built using **React, TypeScript, and Tailwind CSS**.
The application provides a responsive shopping experience with authentication, product browsing, and cart functionality.

## Features

* User Authentication (Login / Signup)
* Product browsing and categories
* Shopping cart functionality
* Search functionality
* Responsive navigation menu
* Form validation using Formik and Yup
* API integration for authentication and product data
* Toast notifications for user feedback
* Unit testing with Jest and React Testing Library
* Products filtering based on category
* Admin dashboard

## Tech Stack

Frontend:

* React.js
* TypeScript
* Tailwind CSS
* Ant Design

State & Forms:

* Formik
* Yup

Routing:

* React Router DOM (Hash Router)

API Handling:

* Axios

Testing:

* Jest
* React Testing Library
* user-event

Notifications:

* React Toastify

## Project Structure

src/
├── components/        # Reusable UI components
├── screens/           # Application pages (Login, Signup, Profile etc.)
├── services/          # API service functions
├── utils/             # Utility functions (auth cookies etc.)
├── routes/            # routes for entire website
├── redux/             # products and cart slices

## Installation

Clone the repository:

```bash
git clone https://github.com/sathish2882/luxe-e-commerce.git
```

Navigate to project folder:

```bash
cd luxe-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Running Tests

Run the test suite using:

```bash
npm test
```

This project uses **Jest and React Testing Library** for component testing.

## Authentication

The login system uses:

* API-based authentication
* Token storage in cookies
* Protected routes for authenticated users
* Role based access

## Responsive Design

The application is fully responsive and optimized for:

* Mobile devices
* Tablets
* Desktop screens

---

⭐ If you like this project, feel free to give it a star!
