# 💰 Personal Finance Tracker

A minimal full-stack web application to track income and expenses, categorize transactions, and view a simple financial summary through a clean dashboard.

---

## 🚀 How to Run the Project

### 🔧 Backend Setup (FastAPI)

1. Navigate to backend folder:
cd backend

2. Create virtual environment (optional but recommended):
python -m venv venv
venv\Scripts\activate   # Windows

3. Install dependencies:
pip install -r requirements.txt

4. Run the server:
uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

---

### 🎨 Frontend Setup (React)

1. Navigate to frontend folder:
cd frontend

2. Install dependencies:
npm install

3. Start the development server:
npm run dev

Frontend runs on:
http://localhost:5173

---

## ⚠️ Known Limitations

- No advanced authentication (basic or not fully secured)
- No data encryption or role-based access
- Limited input validation
- No pagination for large datasets
- Basic UI (focused on functionality)
- Not optimized for production use

---

## 🛠️ Tech Stack

- Frontend: React.js  
- Backend: FastAPI  
- Database: SQLite / MySQL  

---

## 📌 Features

- Add and manage income & expenses  
- Categorize transactions  
- View balance summary  
- Simple dashboard  

---
