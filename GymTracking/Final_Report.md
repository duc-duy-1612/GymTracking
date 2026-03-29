---
title: "FINAL PROJECT REPORT: GymTracking"
author: "Group Members"
date: "2026-03-26"
geometry: "margin=2.5cm"
fontfamily: "times"
fontsize: "12pt"
linestretch: "1.5"
---

# FINAL PROJECT REPORT
**Course:** New Programming Language

## 2.1 Cover Page

*   **University name:** [Your University Name]
*   **Faculty / Department:** Faculty of Information Technology
*   **Course name:** New Programming Language
*   **Project title:** GymTracking - A Full-Stack Fitness and Nutrition Management System
*   **Instructor name:** [Instructor Name]
*   **Group members:**
    1.  Nguyen Van A - 123456
    2.  Nguyen Van B - 123457
*   **Submission date:** [Submission Date]

---

## 2. Table of Contents
1.  **General Requirements**
2.  **Report Structure (Cover Page & TOC)**
3.  **Introduction**
    *   3.1 Reason for choosing the topic
    *   3.2 Project objectives
    *   3.3 Scope of the project
4.  **System Overview**
    *   4.1 Description of the system
    *   4.2 List of features
    *   4.3 Target users
    *   4.4 Use Case Diagram
5.  **System Design**
    *   5.1 System architecture
    *   5.2 Database design
    *   5.3 API Design
6.  **Implementation**
    *   6.1 Technologies used
    *   6.2 System Structure
    *   6.3 Description of main functions
7.  **Testing**
8.  **Deployment**
9.  **Conclusion**
10. **References**
11. **Team Contribution**

---

## 3. Introduction

### 3.1 Reason for choosing the topic
In today's fast-paced world, maintaining a healthy lifestyle is a significant challenge for many individuals. The rise in health consciousness has led to an increased demand for digital tools that help users track their fitness progress, nutritional intake, and overall well-being. The **GymTracking** project was chosen to address this need by providing an accessible, all-in-one web platform. By integrating workout tracking, diet management, and goal setting into a single application, GymTracking empowers users to take control of their health journeys through data-driven insights.

### 3.2 Project objectives
The primary objectives of the GymTracking project are:
1.  To design and develop a robust, responsive full-stack web application using the MERN stack (MongoDB, Express.js, React.js, Node.js).
2.  To implement secure user authentication and authorization mechanisms.
3.  To provide a comprehensive dashboard that visualizes daily caloric intake, workout progress, and sleep/water habits.
4.  To create a highly scalable database capable of storing an extensive library of food items and exercises.
5.  To offer actionable insights and smart goal planning for users based on their recorded health metrics.

### 3.3 Scope of the project
The application covers the following core areas:
*   **User Management:** Secure Sign-Up, Sign-In, and profile management using JWT.
*   **Nutrition Tracking:** Logging daily meals (breakfast, lunch, dinner, snacks) using a dynamic database of 333+ food items.
*   **Workout Management:** Scheduling and tracking workouts with a library of 31 animated exercises.
*   **Health Metrics:** Monitoring daily water intake, sleep patterns, and weight progress.
*   **Analytics & Visualization:** Providing real-time charts and summaries of the user's weekly and monthly progress.

---

## 4. System Overview

### 4.1 Description of the system
*   **What the system does:** GymTracking is a comprehensive health management platform that allows users to log their workouts, track their nutritional intake, and monitor vital health metrics such as sleep and water consumption. It calculates daily caloric needs based on user goals and provides visual feedback to ensure users stay on track.
*   **How it works at a high level:** Users interact with a responsive React.js frontend. When a user performs an action (e.g., logging a meal), the frontend sends a RESTful API request to the Node.js/Express.js backend. The backend processes the request, interacts with the MongoDB database to store or retrieve data, and sends a JSON response back to the frontend, which updates the UI dynamically.

### 4.2 List features clearly
*   **Authentication (Login/Register):**
    *   *Description:* Secure user registration and login system using bcrypt for password hashing and JSON Web Tokens (JWT) for session management.
    *   *Purpose:* To protect user privacy and ensure that health data is strictly tied to individual accounts.
*   **CRUD Operations:**
    *   *Description:* Create, Read, Update, and Delete logic for workouts, nutrition logs, daily summaries, and health metrics.
    *   *Purpose:* To allow users full control over their historical health data and to correct any logging errors.
*   **Search and Filtering:**
    *   *Description:* Advanced search and category-based filtering (comboboxes) for the extensive food and exercise library.
    *   *Purpose:* To enable users to quickly find specific meals or workouts without scrolling through hundreds of entries.
*   **Admin Management:**
    *   *Description:* Backend scripts and seed files that manage the pre-populated library of foods, exercises, brands, and coach classes.
    *   *Purpose:* To maintain data consistency across the application and provide a rich initial dataset for users.
*   **Data Visualization (Charts):**
    *   *Description:* Integration of Chart.js to render weekly and monthly progress for weight and calories.
    *   *Purpose:* To provide users with intuitive visual feedback on their fitness journey.

### 4.3 Target users
*   **Guest:** Can view the landing page and read about the features of GymTracking but cannot access the dashboard or log data without an account.
*   **Registered User:** Has full access to the application. Can log workouts, track nutrition, update their profile, and view analytics.
*   **Admin:** Developers/system administrators who manage the core database seed files (`seedFoodItems.js`, `seedExercises.js`) and ensure system uptime and data integrity.

### 4.4 Use Case Diagram
*(Note for PDF export: Insert the exported UML Use Case Diagram image here)*

*   **Diagram Image:** `[Insert use_case_diagram.png]`
*   **Short explanation of interactions:** The Registered User interacts with the Workout Manager, Nutrition Tracker, and Profile settings. The System Backend validates tokens. Admin initializes Core Data.

---

## 5. System Design

### 5.1 System architecture
*   **Client–Server model:** The system strictly follows a client-server architecture. The React frontend (Client) operates independently of the Node.js backend (Server), communicating exclusively via HTTP/HTTPS RESTful APIs.
*   **MVC pattern:** The backend implements an MVC (Model-View-Controller) inspired pattern:
    *   **Models:** Mongoose schemas defining MongoDB collections data structure (`User.js`, `Workout.js`, `Nutrition.js`).
    *   **Views:** Replaced by the React frontend which handles rendering the UI.
    *   **Controllers:** Express.js route handlers encapsulating business logic (`userRoutes.js`, `workoutRoutes.js`).
*   **Diagram:** 
`[ React.js Frontend ] <--- REST API (JSON) ---> [ Node.js/Express.js Backend ] <---> [ MongoDB Database ]`

### 5.2 Database design
The application uses **MongoDB**, a NoSQL database. Below is the simplified ER schema structure:

*   **Include ER Diagram:** `[Insert er_diagram.png]`

**Tables / Collections:**

1.  **User Collection**
    *   *Name:* `users`
    *   *Fields:* `_id` (ObjectId), `name` (String), `email` (String), `password` (String), `goal` (String), `weight` (Number), `height` (Number).
    *   *Primary key:* `_id`
    *   *Relationships:* One-to-Many to Workouts and Nutrition.
2.  **Workout Collection**
    *   *Name:* `workouts`
    *   *Fields:* `_id` (ObjectId), `userId` (ObjectId), `exerciseId` (ObjectId), `sets` (Array), `date` (Date).
    *   *Primary key:* `_id` | *Foreign key:* `userId` (ref User), `exerciseId` (ref Exercise)
    *   *Relationships:* Belongs to User.
3.  **Nutrition Collection**
    *   *Name:* `nutritions`
    *   *Fields:* `_id` (ObjectId), `userId` (ObjectId), `mealType` (String), `foodItems` (Array of Refs), `totalCalories` (Number), `date` (Date).
    *   *Primary key:* `_id` | *Foreign key:* `userId` (ref User)
    *   *Relationships:* Belongs to User.
4.  **FoodItem Collection**
    *   *Name:* `fooditems`
    *   *Fields:* `_id` (ObjectId), `name` (String), `calories` (Number), `protein` (Number), `carbs` (Number), `fat` (Number), `category` (String).
    *   *Primary key:* `_id`
5.  **Exercise Collection**
    *   *Name:* `exercises`
    *   *Fields:* `_id` (ObjectId), `name` (String), `targetMuscle` (String), `gifUrl` (String).
    *   *Primary key:* `_id`

### 5.3 API Design
RESTful APIs are implemented. Below is a summary table of core endpoints:

| Endpoint | Method | Request Format | Response Format | Description |
| :--- | :---: | :--- | :--- | :--- |
| `/api/auth/register` | POST | JSON {name, email, password} | JSON {token, user} | Registers a new user. |
| `/api/auth/login` | POST | JSON {email, password} | JSON {token, user} | Authenticates a user. |
| `/api/workouts` | GET | Headers {Authorization: Bearer} | JSON [workout data] | Retrieves workouts for the logged-in user. |
| `/api/workouts` | POST | JSON {exerciseId, sets, date} | JSON {workout} | Creates a new workout log. |
| `/api/nutrition` | GET | Headers {Authorization: Bearer} | JSON [nutrition log] | Retrieves nutrition history |
| `/api/nutrition/:id` | DELETE | Params {id} | 200 OK | Deletes a nutrition log. |
| `/api/users/profile` | PUT | JSON {weight, height, goal} | JSON {user} | Updates user health profile. |

---

## 6. Implementation

### 6.1 Technologies used
*   **Frontend: React.js (Vite)**
    *   *Why chosen:* React's component-based structure allows for a highly modular, reusable, and maintainable codebase. Vite provides extremely fast Hot Module Replacement (HMR) for rapid development. `react-router-dom` handles client-side routing, and `chart.js` was used for powerful visual data representation.
*   **Backend: Node.js, Express.js**
    *   *Why chosen:* Node.js allows JavaScript to be written on the server, unifying the language across the stack. Express.js is a lightweight framework that streamlines API routing and middleware configuration.
*   **Database: MongoDB (Mongoose)**
    *   *Why chosen:* MongoDB's document-oriented JSON-like structure pairs flawlessly with JavaScript and Express. Mongoose provides straightforward schema validation and query building.

### 6.2 System Structure
*   **Folder structure:**
    *   `frontend/`: Contains the React application (`src/components`, `src/pages`, `src/context`, `src/api`).
    *   `backend/`: Contains the Express server application (`src/controllers`, `src/models`, `src/routes`, `src/middlewares`).
*   **Main modules:**
    *   `authMiddleware`: Validates JWT tokens on protected routes.
    *   `controllers`: Contains the specific action logic for each route (e.g., `userController`, `workoutController`).
    *   `context (Frontend)`: React Context API to provide global state management for the authenticated user and UI themes.

### 6.3 Description of main functions
*   **Authentication:**
    *   *Login/Register flow:* The user inputs credentials. The frontend hashes (locally or sends plain if SSL is active) and POSTs to `/api/auth`. The backend bcrypt compares/hashes the password. If valid, it signs a JWT using a secure `process.env.JWT_SECRET` and returns it.
    *   *JWT handling:* The token is stored in `localStorage` and sent in the `Authorization` header of all subsequent API calls.
*   **CRUD Operations:**
    *   *Create / Read / Update / Delete logic:* Users add food items to a meal. The frontend POSTs an array of item IDs. The backend validates and saves the `Nutrition` document. The UI instantly refetches (Read) the data. Users can also Delete specific logs.
*   **Search & Filtering:**
    *   *How users search data:* Users search for foods via a text input and category dropdown. The frontend sends a GET request with query parameters (e.g., `?search=apple&category=Fruit`). The backend executes a MongoDB Regex search (`{ name: { $regex: search, $options: 'i' } }`) and returns paginated results.
*   **Additional Features:**
    *   *Smart Dashboard charts:* Real-time updates of caloric progress using dynamic ring charts.
    *   *Animated Exercise Guide:* Users see a GIF representation of the exercise.
    *   *Nutrition History Calendar:* Visual color-coded grid for monthly calorie limit tracking.

---

## 7. Testing
*   **How the system was tested:** Postman was used for extensive backend API endpoint testing. Manual UI testing was performed on the frontend to ensure all forms, buttons, and responsive layouts worked across Chrome, Firefox, and Edge.
*   **Some test cases:**
    *   *TC01:* **Invalid Login.** Input: "wrong@email.com", "pass". Expected Result: 401 Unauthorized, UI shows "Invalid credentials". Results: Passed.
    *   *TC02:* **Log Nutrition.** Input: Add "Banana" (105 kcal) to Lunch. Expected Result: Lunch total calories increase by 105, dashboard circular progress updates. Results: Passed.
    *   *TC03:* **Protected Route Access.** Input: Access `/dashboard` without token. Expected Result: Redirect to `/login`. Results: Passed.
*   **Results:** All crucial paths are working optimally. Data persists correctly in MongoDB.

---

## 8. Deployment
*   **How to run the project locally:**
    1.  Ensure Node.js and MongoDB are installed.
    2.  Clone the repository and open the root folder.
    3.  Navigate to `backend/` and run `npm install`. Create a `.env` file with `MONGO_URI` and `JWT_SECRET`. Run `npm run seed` to populate the database, then `npm run dev`.
    4.  Navigate to `frontend/` and run `npm install`, then `npm run dev`.
    5.  Access the application at `http://localhost:5173`.
*   **Demo link:** `[Insert GitHub Pages / Vercel / Render Link if available]`

---

## 9. Conclusion
*    **Summarize:**
    *   **What has been achieved:** A fully functional, responsive health tracking web application was successfully developed and deployed. The system accurately handles complex data relationships between users, foods, and exercises.
    *   **Whether objectives were met:** Yes, all core objectives—from robust MERN stack implementation to building secure JWT authentication and comprehensive dashboard analytics—were successfully met.
*   **Future Work (Suggested improvements):**
    *   *Performance optimization:* Implement Redis caching for the large food library to reduce database load.
    *   *More features:* Integrate with wearable APIs (Apple Health, Google Fit) for automatic data syncing.
    *   *AI enhancements:* Adding an AI chatbot capable of recommending daily meal plans based on user allergies and caloric deficits using natural language processing.

---

## 10. References
1.  MongoDB Documentation: https://www.mongodb.com/docs/
2.  Express.js Guide: https://expressjs.com/
3.  React.js Official Specs: https://react.dev/
4.  Node.js API Reference: https://nodejs.org/docs/latest/api/
5.  Vite Tooling: https://vitejs.dev/

---

## Team Contribution

| No. | Full Name | Student ID | Responsibilities | Completion (%) |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Nguyen Van A | 123456 | Frontend (UI, React components, Axios integration) | 100% |
| 2 | Nguyen Van B | 123457 | Backend (API routines, Authentication, Database Seed) | 90% |

---
*End of Report*
