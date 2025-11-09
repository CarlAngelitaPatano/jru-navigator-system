import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaMapMarkedAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import usersData from "./users.json";
import attendanceData from "./attendance.json";
import "./AdminDashboard.css";
import mapImage from "../assets/map.png";

// ChartJS imports
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchUser, setSearchUser] = useState("");
  const [searchAttendance, setSearchAttendance] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showModal, setShowModal] = useState(null); // for Graph Report

  useEffect(() => {
    const usersArray = Object.keys(usersData).map((id) => ({
      id,
      ...usersData[id],
    }));
    setUsers(usersArray);
    setAttendance(attendanceData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAiQuery = () => {
    if (!aiInput) return;
    setAiResponse(`AI Response to: "${aiInput}"`);
    setAiInput("");
  };

  const totalUsers = users.filter((u) => u.role !== "admin").length;
  const totalAttendance = Object.keys(attendance).length;

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.id.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.room.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredAttendance = Object.keys(attendance).filter(
    (id) =>
      id.toLowerCase().includes(searchAttendance.toLowerCase()) ||
      (usersData[id]?.name || "").toLowerCase().includes(searchAttendance.toLowerCase())
  );

  // Sidebar Menu Items
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "users", name: "Users", icon: <FaUsers /> },
    { id: "attendance", name: "Attendance", icon: <FaClipboardList /> },
    { id: "campus-map", name: "Campus Map", icon: <FaMapMarkedAlt /> },
    { id: "graph", name: "Graph Report", icon: <FaClipboardList />, action: () => setShowModal("graph") },
    { id: "settings", name: "Settings", icon: <FaCog /> },
    { id: "logout", name: "Logout", icon: <FaSignOutAlt />, action: handleLogout },
  ];

  // Chart Data for Graph Report
  const chartData = {
    labels: users.filter(u => u.role !== "admin").map(u => u.name),
    datasets: [
      {
        label: "Attendance",
        data: users
          .filter(u => u.role !== "admin")
          .map(u => (attendance[u.id] === "present" ? 1 : 0)),
        backgroundColor: users
          .filter(u => u.role !== "admin")
          .map(u => (attendance[u.id] === "present" ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)")),
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "All Students Attendance (1 = Present, 0 = Absent)" },
    },
    scales: {
      x: { min: 0, max: 1, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2>{sidebarOpen ? "JRU Navigator" : "JRU"}</h2>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              title={!sidebarOpen ? item.name : ""}
              className={activeTab === item.id ? "active-tab" : ""}
              onClick={() => {
                if (item.action) item.action();
                else setActiveTab(item.id);
              }}
            >
              <span className="icon">{item.icon}</span>
              {sidebarOpen && <span className="label">{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <section className="dashboard-overview">
            <h1>Dashboard Overview</h1>
            <div className="stats-cards">
              <div className="card total-users">
                <h3>Total Users</h3>
                <p>{totalUsers}</p>
              </div>
              <div className="card total-attendance">
                <h3>Total Attendance</h3>
                <p>{totalAttendance}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "users" && (
          <section className="users-section">
            <h2>Registered Users</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="search-input"
            />
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Room</th>
                    <th>Floor</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.room}</td>
                      <td>{user.floor}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "attendance" && (
          <section className="attendance-section">
            <h2>Attendance</h2>
            <input
              type="text"
              placeholder="Search attendance..."
              value={searchAttendance}
              onChange={(e) => setSearchAttendance(e.target.value)}
              className="search-input"
            />
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((id) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{usersData[id]?.name || "Unknown"}</td>
                      <td className={attendance[id] === "present" ? "present" : "absent"}>
                        {attendance[id]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "campus-map" && (
          <section className="campus-map-section">
            <h2>Campus Map</h2>
            <img src={mapImage} alt="Campus Map" className="campus-map-img" />
          </section>
        )}

        {activeTab === "settings" && (
          <section className="settings-section">
            <h2>Settings & AI Assistant</h2>
            <div className="ai-assistant">
              <textarea
                placeholder="Ask AI anything..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              <button onClick={handleAiQuery}>Submit</button>
              <div className="ai-response">{aiResponse}</div>
            </div>
          </section>
        )}

        {/* Graph Report Modal */}
        {showModal === "graph" && (
          <div className="modal-section">
            <h2>Graph Report</h2>
            {users.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p>Loading attendance...</p>
            )}
            <button className="close-btn" onClick={() => setShowModal(null)}>
              Close
            </button>
          </div>
        )}
      </main>

      {/* Dark/Light Mode Toggle */}
      <button
        id="theme-toggle"
        onClick={() => document.body.classList.toggle("light-mode")}
      >
        🌓
      </button>
    </div>
  );
}

export default AdminDashboard;
