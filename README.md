# 🧭 JRU Navigator System

A web-based **Campus Navigation and Management System** developed for **Jose Rizal University (JRU)**.  
This system provides interactive campus features for students and administrators, including attendance tracking, registration, and reporting tools.

---

## 🚀 Features

### 🧑‍💻 Login & Authentication
- Secure login for **students** and **admins**.
- Admin access to management reports and attendance.
- JSON-based user storage for demonstration.

### 📝 Student Registration
- New students can register their **Student ID** and credentials.
- Data is stored locally (`users.json`) for login authentication.

### 🗺️ Campus Map
- Interactive **2D/3D map** of the JRU campus.
- Mouse drag and zoom controls.
- Faculty markers and tooltips for navigation.

### 📊 Admin Dashboard
- Sidebar with access to:
  - **Campus Info**
  - **3D Tour**
  - **Campus Map**
  - **Mission & Vision**
  - **Faculty Directory**
  - **Graph Report**
  - **Management Report**
  - **Settings**
  - **Logout**
- Visual **graph reports** showing total registered students.

### ⏱️ Attendance Tracking
- Admin can mark and view student attendance records.
- Data stored in `attendance.json`.

---

## 🧱 Technologies Used

- **Frontend:** React.js (with JSX and CSS Modules)
- **Backend:** Node.js + PHP (for local data handling)
- **Database:** JSON (local data simulation)
- **Version Control:** Git + GitHub
- **Design:** Professional, dark-themed JRU color scheme

---

## 📂 Project Structure
src/
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── CampusMap.jsx
│ ├── AdminDashboard.jsx
│ ├── *.css
├── users.json
├── attendance.json
├── App.jsx
├── server.js
├── register_user.php
├── mark_attendance.php


---

## 🛡️ Security Testing (OWASP ZAP)
Security was tested using **OWASP ZAP**:
- Input validation on forms.
- Protection from basic XSS and SQL injection via sanitization.
- Proper authentication flow verification.
- Secure handling of user sessions.

---

## 👨‍🏫 User’s Manual (Step-by-Step Guide)

1. **Login**
   - Open the website.
   - Enter your **Student ID** and **Password**.
   - Click **Login** to access the system.

2. **Register**
   - Click **Register** on the Login page.
   - Fill up your **Student ID, Name, and Password**.
   - Click **Submit** to create an account.

3. **Admin Access**
   - Admins can log in using their credentials.
   - Use the sidebar to view reports, attendance, and campus map.

4. **View Campus Map**
   - Navigate the interactive 2D/3D map using mouse drag or zoom.
   - Click markers to see faculty details.

---

## 🧑‍💼 Developer
**Carl Angelo Patano**  
Bachelor of Science in Information Technology  
Jose Rizal University  

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).


