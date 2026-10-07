# LearnHub 🎓 - Full-Stack Next.js LMS Platform

A production-ready Learning Management System (LMS) built with the Next.js App Router. Developed for the Dev Weekends '26 Fellowship, this platform demonstrates full-stack capabilities including role-based access control, secure media streaming, and dynamic database interactions.

🔗 **[Live Demo](https://learnhub-lms-psi.vercel.app/)**

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Secure authentication flow separating Admin privileges (course creation, media uploads) from Student views (enrollment, learning dashboard) using NextAuth.js.
* **Smart Media Handling:** Intelligent image resolution with robust fallbacks. Automatically matches relevant topic thumbnails for courses and handles secure video streaming.
* **Full-Stack Architecture:** Utilizes Next.js API Routes for backend logic, database seeding, and secure data fetching without needing a separate Node/Express server.
* **Demo Checkout Flow:** Fully simulated payment gateway for course enrollment, generating database records and unlocking premium lesson content.
* **Optimized UI/UX:** Fully responsive, modern design with custom Tailwind CSS, featuring persistent layouts and interactive client-side components mixed with optimized Server Components.

## 🛠️ Tech Stack
* **Framework:** Next.js 14+ (App Router)
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Authentication:** NextAuth.js
* **Styling:** Tailwind CSS
* **Deployment:** Vercel

## 🚀 Local Setup & Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
Create a .env.local file in the root directory and add your environment variables:

Code snippet
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=http://localhost:3000
Start the development server:

Bash
npm run dev
Seed the database with sample courses and an admin account by navigating to:
http://localhost:3000/api/seed?secret=lms-seed

👨‍💻 Developer
Muhammad Haroon Khan
*Software Engineer & Web Development Fellow*
