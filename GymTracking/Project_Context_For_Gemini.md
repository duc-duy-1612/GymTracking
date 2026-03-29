# GymTracking Project Context
**Target Audience:** Gemini (AI Assistant)
**Purpose:** To provide complete, accurate context of the GymTracking project for writing a comprehensive academic project report (30-50 pages).

## 1. Project Overview
GymTracking is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It serves as an all-in-one platform for users to manage their fitness routines, track nutritional intake, set health goals, and monitor progress over time (weight, sleep, water, measurements). It incorporates robust user authentication, complex automatic calculations for health metrics (BMR, TDEE, BMI), and interactive UI dashboards.

## 2. Technology Stack
*   **Frontend:** React.js (Vite), React Router Dom, Axios, Chart.js, Bootstrap 5.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB via Mongoose.
*   **Security layer:** JSON Web Tokens (JWT) for stateless session management, bcryptjs for password hashing.
*   **Additional libraries:** dotenv for environment variables, cors for cross-origin integration.

## 3. Database Architecture (Key MongoDB Collections)
The backend enforces strong relational schemas via Mongoose ObjectId references.

### 3.1 User Collection (`users`)
*   `name` (String), `email` (String, unique), `password` (String, hidden).
*   `role` (String): 'user' | 'admin'.
*   `gender` (String): 'male' | 'female'.
*   `age` (Number), `activityLevel` (Number).
*   `measurements`: nested object with `weight`, `height`, `waist`.
*   `goals`: nested object `targetType` ('cut', 'bulk', 'maintain'), `targetWeight`, `durationMonths`.
*   `autoStats` (Automatically calculated upon Mongoose `pre('save')` hook):
    *   `bmi` (Body Mass Index)
    *   `bmr` (Basal Metabolic Rate based on Harris-Benedict formula + gender adjustment)
    *   `tdee` (Total Daily Energy Expenditure = BMR * activityLevel)
    *   `targetBmi`

### 3.2 Workout Collection (`workouts`)
*   `userId` (Ref: User), `date` (Date).
*   `startedAt`, `endedAt` (Date), `totalDurationMinutes` (Number), `caloriesBurned` (Number).
*   `exercises`: Array of sub-documents representing the routine:
    *   `exerciseId` (Ref: Exercise), `name`, `muscleGroup`, `type`.
    *   `sets` (Number), `repsMin` (Number), `repsMax` (Number), `weightKg` (Number).
    *   `completedSets`: Array of actual performed sets (`reps`, `weightKg`).
*   `physicalCondition`: `energyLevel` (Number), `injuryNotes` (String).

### 3.3 Nutrition Collection (`nutritions`)
*   `userId` (Ref: User), `date` (Date).
*   `mealType` (Enum: 'Breakfast', 'Lunch', 'Dinner', 'Pre-workout', 'Post-workout', 'Snack').
*   `foodItem` (String) representing the name of the food.
*   `macros`: Nested object mapping exactly to the nutritional value (`calories`, `protein`, `carbs`, `fat`, `glucose`).
*   `quantity` (Number), `unit` (String).

### 3.4 FoodItem Collection (`fooditems`)
(Global database of curated foods)
*   `name` (String), `calories` (Number), `protein`, `carbs`, `fat`, `glucose` (Number).
*   `category` (String - indicating cuisine or food type like 'VN', 'US', etc.).
*   `image` (String URL).

### 3.5 Exercise Collection (`exercises`)
(Global library of valid physical exercises)
*   `name` (String), `muscleGroup` (String).
*   `type` (Enum: 'Strength', 'Hypertrophy', 'Cardio', 'Mobility').
*   `targetMuscles` (Array of Strings).
*   `defaultSets`, `defaultRepsMin`, `defaultRepsMax` (Number defaults).
*   `imageUrl`, `videoUrl` (Strings: visual guide for users).
*   `caloriesPerSet` (Number), `isActive` (Boolean).

### 3.6 Other Logging Collections
*   **SleepLog / HealthLog / DailySummary:** Collections to track hydration (water intake in ml), sleep duration (hours + quality), daily weigh-ins, and aggregate daily summaries consolidating net calories and steps.

## 4. Key Workflows & Features

### 4.1 Authentication & Profile Setup
*   **Workflow:** User registers. Backend creates `User` document. User sets age, weight, height, gender. The Mongoose `pre('save')` hook intercepts this and immediately calculates exactly what their BMI, BMR, and TDEE are.
*   **Security:** Tokens are assigned on login. Client stores token in localStorage, appending to `Authorization: Bearer <token>` in Axios interceptors.

### 4.2 Diet / Nutrition Tracking
*   **Workflow:** User selects a date via calendar. They select `mealType` (e.g., Lunch). They search the `fooditems` collection via the API (search queries filter by regex). Upon selecting a food item and confirming quantity, the app multiplies macros and creates a `Nutrition` log.
*   **Dashboard:** UI reads all `Nutrition` logs for the current day, sums `macros.calories`, and compares it to the user's `User.autoStats.tdee` (or goal target) to render circular "remaining calories" charts.

### 4.3 Workout Execution
*   **Workflow:** User creates a new workout session. They browse the `exercises` registry and add items to their current physical routine. During the workout, they log `completedSets` (exact reps and lifting weight).
*   **Analytics:** Saving the workout updates the `totalDurationMinutes` and calculates `caloriesBurned` to deduct from the daily caloric net.

### 4.4 Data Seed System (Admin capability)
*   Large `seedFoodItems.js` (thousands of items) and `seedExercises.js` (31+ exercises w/ GIFs) are used to initially populate the database to ensure the user has content to interact with immediately post-signup.

## 5. System Architecture
*   **Frontend (React/Vite):** Extremely modular (`src/pages`, `src/components`, `src/api`, `src/context`). State logic is handled via Context API + React Hooks. Axios handles HTTP traffic. Protected routes wrap private components preventing unauthorized access.
*   **Backend (Node/Express):** Follows standard MVC pattern structure (`src/controllers/`, `src/routes/`, `src/models/`, `src/middlewares/`). `authMiddleware.js` parses JWT.

## Output Directive for Gemini:
When generating the 30-50 page report based on requirements:
1.  **Dramatically expand on the MVC model** describing how the React views talk to Express controllers.
2.  **Generate 15 - 20 complex Test Cases** mapping to the features above (e.g., Testing the BMR calculation logic, JWT token expiration, or Meal addition).
3.  **Provide exhaustive API tables:** Document POST/GET/PUT for `/api/users`, `/api/workouts`, `/api/nutrition` incorporating the exact database fields listed above.
4.  **Describe the UI components:** Explain how a generic Dashboard would visualize the "macro breakdown" or "workout history" list. Include descriptive placeholders for screenshots.
