import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CampusMap.css";
import mapImage from "../assets/map.png";

// ChartJS imports for Graph Report
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

function CampusMap() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [darkMode, setDarkMode] = useState(true);
  const [activeView, setActiveView] = useState("info");
  const [showModal, setShowModal] = useState(null);
  const [visitCount, setVisitCount] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [attendanceMessage, setAttendanceMessage] = useState("");

  // Increment visit count
  useEffect(() => {
    const visits = parseInt(localStorage.getItem("visitCount") || "0") + 1;
    localStorage.setItem("visitCount", visits);
    setVisitCount(visits);
  }, []);

  // Dark/Light mode
  useEffect(() => {
    if (darkMode) document.body.classList.remove("light-mode");
    else document.body.classList.add("light-mode");
  }, [darkMode]);

  // Fetch user attendance from local file (public folder)
  useEffect(() => {
    if (user && user.id) {
      fetch("/attendance.json")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch attendance data");
          return res.json();
        })
        .then((data) => {
          setAttendanceStatus(data[user.id] || "absent");
        })
        .catch((err) => {
          console.error("Error fetching attendance:", err);
          setAttendanceMessage("❌ Could not fetch attendance data");
        });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleTurnInAttendance = () => {
    if (!user.id) {
      setAttendanceMessage("❌ User ID not found in localStorage");
      return;
    }
    setAttendanceStatus("present");
    setAttendanceMessage("✅ Attendance recorded successfully!");
  };

  if (!user) return <p>Loading map... Please log in.</p>;

  return (
    <div className="campus-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">JRU Navigator</div>

        <div className={`welcome-card ${darkMode ? "dark" : "light"}`}>
          <h3>{user.name}</h3>
          <p>
            Classroom: {user.room} <br />
            Floor: {user.floor}
          </p>
        </div>

        <nav>
          <button
            className={activeView === "info" ? "active" : ""}
            onClick={() => {
              setActiveView("info");
              setShowModal(null);
            }}
          >
            Campus Info
          </button>
          <button
            className={activeView === "3d" ? "active" : ""}
            onClick={() => {
              setActiveView("3d");
              setShowModal(null);
            }}
          >
            3D Tour
          </button>
          <button
            className={activeView === "map" ? "active" : ""}
            onClick={() => {
              setActiveView("map");
              setShowModal(null);
            }}
          >
            Campus Map
          </button>
          <button onClick={() => setShowModal("mission")}>Mission & Vision</button>
          <button onClick={() => setShowModal("faculty")}>Faculty Directory</button>
          <button onClick={() => setShowModal("graph")}>Graph Report</button>
          <button onClick={() => setShowModal("management")}>Management Report</button>
          <button onClick={() => setShowModal("attendance")}>My Attendance</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      {/* Right Content Panel */}
      <section className="content-panel">
        {activeView === "info" && (
          <div className="section-container">
            <h2>Campus Info</h2>
            <p>Click the buttons on the left to view 3D Tour, Campus Map, or reports.</p>
          </div>
        )}

        {activeView === "3d" && (
          <div className="section-container">
            <h2>Campus 3D Tour</h2>
            <iframe
              title="Campus 3D Tour"
              src="https://cloud.3dvista.com/hosting/6183113/40/index.htm"
              width="100%"
              height="400"
              style={{
                borderRadius: "20px",
                border: "none",
                boxShadow: darkMode
                  ? "0 10px 20px rgba(0,0,0,0.5)"
                  : "0 10px 20px rgba(0,0,0,0.2)",
              }}
            ></iframe>
          </div>
        )}

        {activeView === "map" && (
          <div className="section-container">
            <h2>Campus Map</h2>
            <img src={mapImage} alt="Campus Map" className="campus-map-img" />
          </div>
        )}

        {/* Mission & Vision */}
        {showModal === "mission" && (
          <div className="section-container">
            <h2>Mission & Vision</h2>
            <h4>Mission</h4>
            <p>
              To develop students into responsible citizens and leaders who embody
              the values of Rizalian education excellence, integrity, and service
              to the nation.
            </p>
            <h4>Vision</h4>
            <p>
              JRU envisions itself as a leading academic institution recognized
              for innovation, quality education, and commitment to social progress.
            </p>
            <button className="close-btn" onClick={() => setShowModal(null)}>Close</button>
          </div>
        )}

        {/* Faculty Directory */}
        {showModal === "faculty" && (
          <div className="section-container">
            <h2>Faculty Directory</h2>
            <ul className="faculty-list">
              {[
                { name: "MONREAL, RICHARD NAJE", building: "Building A" },
                { name: "URANI, RODEL COLLADO", building: "Main Library" },
                { name: "BONUS, DON ERICK JAMON", building: "Building H" },
                { name: "ATANACIO, MARLON LAJARCA", building: "Gymnasium" },
                { name: "CARIÑO, ISRAEL VELASQUEZ", building: "Building B" },
                { name: "LOYOLA, VIRGINIA BENITEZ", building: "University Chapel" },
              ].map((faculty, index) => (
                <li key={index}>{faculty.name} — {faculty.building}</li>
              ))}
            </ul>
            <button className="close-btn" onClick={() => setShowModal(null)}>Close</button>
          </div>
        )}

        {/* Graph Report */}
        {showModal === "graph" && (
          <div className="section-container">
            <h2>Graph Report</h2>

            {attendanceStatus !== null ? (
              <Bar
                data={{
                  labels: [user.name],
                  datasets: [
                    {
                      label: "Attendance Status",
                      data: [attendanceStatus === "present" ? 1 : 0],
                      backgroundColor: attendanceStatus === "present"
                        ? "rgba(75, 192, 192, 0.6)"
                        : "rgba(255, 99, 132, 0.6)",
                    },
                  ],
                }}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: "My Attendance (1 = Present, 0 = Absent)" },
                  },
                  scales: {
                    x: { min: 0, max: 1, ticks: { stepSize: 1 } },
                  },
                }}
              />
            ) : (
              <p>Loading attendance...</p>
            )}

            <button className="close-btn" onClick={() => setShowModal(null)}>Close</button>
          </div>
        )}

        {/* Management Report */}
        {showModal === "management" && (
          <div className="section-container">
            <h2>Management Report</h2>
            <p>Total Site Visits:</p>
            <h2>{visitCount}</h2>
            <p>Note: Counts visits per browser session using localStorage.</p>
            <button className="close-btn" onClick={() => setShowModal(null)}>Close</button>
          </div>
        )}

        {/* My Attendance */}
        {showModal === "attendance" && (
          <div className="section-container">
            <h2>My Attendance</h2>
            <p>Status: <strong>{attendanceStatus || "absent"}</strong></p>
            {attendanceStatus !== "present" && (
              <button className="close-btn" onClick={handleTurnInAttendance}>
                Turn In Attendance
              </button>
            )}
            {attendanceMessage && <p style={{ marginTop: "10px" }}>{attendanceMessage}</p>}
            <button className="close-btn" onClick={() => setShowModal(null)}>Close</button>
          </div>
        )}
      </section>

      {/* Dark/Light Toggle */}
      <button
        id="theme-toggle"
        onClick={() => setDarkMode((prev) => !prev)}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
    </div>
  );
}

export default CampusMap;
