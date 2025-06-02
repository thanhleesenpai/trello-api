
# Project Title

A brief description of what this project does and who it's for

# 📝 Trello Clone – Project Management App

A full-stack Trello-like task management application built with **React.js**, **Express.js**, and **MongoDB**.

## 🔗 Live Demos

🌐: [https://trello-web-ten-kappa.vercel.app](https://trello-web-ten-kappa.vercel.app)

---

## 📁 Project Structure

### 🔸 Frontend
- 📂 Repository: [trello-web](https://github.com/thanhleesenpai/trello-web)
- 🌟 Stack: React, Redux Toolkit, Axios, Tailwind CSS

### 🔹 Backend
- 📂 Repository: [trello-api](https://github.com/thanhleesenpai/trello-api)
- 🌟 Stack: Express.js, MongoDB, JWT, Joi, Brevo (email service)

---

## ⚙️ Features

✅ List, and card creation (like Trello)  
✅ Drag & Drop with real-time UI updates  
✅ User authentication with JWT  
✅ Token refresh mechanism  
✅ Input validation using Joi  
✅ Email integration (Brevo API)  
✅ Protected APIs and middleware for error handling  
✅ Clean and scalable project structure  

---

## 🧪 Technologies Used

**Frontend:**
- React + Vite
- Redux Toolkit
- Axios
- TailwindCSS

**Backend:**
- Node.js + Express
- MongoDB Atlas
- JSON Web Token (JWT)
- Joi (validation)
- Dotenv (env config)
- Brevo (Sendinblue) for transactional email

---

## 🚀 Getting Started

### Clone Repos
```bash
git clone https://github.com/thanhleesenpai/trello-api
git clone https://github.com/thanhleesenpai/trello-web
```
### Backend Setup
📁 .env file (in trello-api)

Create a .env file and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=your_database_name

ACCESS_TOKEN_SECRET_SIGNATURE=your_jwt_access_secret
ACCESS_TOKEN_LIFE=15m

REFRESH_TOKEN_SECRET_SIGNATURE=your_jwt_refresh_secret
REFRESH_TOKEN_LIFE=7d

WEBSITE_DOMAIN_PRODUCTION=https://trello-web-ten-kappa.vercel.app

BREVO_API_KEY=your_brevo_api_key
ADMIN_EMAIL_ADDRESS=admin@example.com
ADMIN_EMAIL_NAME=Trello Admin
```
#### Install & Run
```bash
cd trello-api
yarn install
yarn dev
```
###💻 Frontend Setup

####Install & Run
```bash
cd trello-web
yarn install
yarn dev
```

📸 Screenshots

