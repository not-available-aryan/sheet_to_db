# 📋 sheet_to_db

**Project Description:**  
A backend server built with Node.js and Express.js that authenticates users using JWT and Google OAuth, receives data from Google Sheets (such as Google Form responses), processes it according to business rules, and saves it into a MongoDB database.

---

## 🚀 Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- Google OAuth 2.0
- Ngrok (for tunneling local server)

---

## 🛠️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/not-available-aryan/sheet_to_db.git
   cd sheet_to_db
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**  
   Create a `.env` file and add the following:
   ```
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
   
4. **Start the server:**
   ```bash
   node server.js
   ```

5. **Expose server using ngrok:**
   ```bash
   ngrok http 3000
   ```
   (Get a public URL to connect with Google Sheets.)

---

## 🔐 Authentication Flow
- Users log in via **Google Sign-In**.
- Server verifies Google user and issues a **JWT token**.
- API requests must include the valid JWT token in the header (`Authorization: Bearer <token>`).

---

## 📬 API Usage (Main Endpoints)

| Method | Endpoint         | Description                             |
|:------:|:----------------- |:--------------------------------------- |
| POST   | `/api/sheet/upload` | Receive Google Sheets data and process it |
| POST   | `/api/auth/google` | Authenticate user using Google OAuth |
| GET    | `/api/user/profile` | Get authenticated user details |

---

## 🧠 Business Logic
- Incoming sheet data is **evaluated** according to pre-defined rules inside the `/evaluation/` folder.
- Processed data is **stored into MongoDB** under specific collections.
- Evaluation may include scoring, grading, or categorizing responses.

---

## 🛡️ Security
- Protected routes require **valid JWT token**.
- Unauthorized or invalid users are blocked.

---

## 📈 Future Improvements
- Add form schema validation.
- Dashboard to monitor submissions.
- Refresh token strategy for better OAuth handling.

---

## 📄 License
Open Source — free to use!

---

# ⚡ Quick Notes
- Always keep your server running when setting up with Google Sheets.
- Remember: ngrok public URLs change unless you have a paid plan.

---
