const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

const attendanceFile = path.join(__dirname, "attendance.json");

// GET attendance
app.get("/attendance.json", (req, res) => {
  fs.readFile(attendanceFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading file" });
    res.json(JSON.parse(data));
  });
});

// POST update attendance
app.post("/update_attendance.php", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ status: "error", message: "ID is required" });

  fs.readFile(attendanceFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ status: "error", message: "Error reading file" });
    
    const attendance = JSON.parse(data);
    attendance[id] = "present";

    fs.writeFile(attendanceFile, JSON.stringify(attendance, null, 2), (err) => {
      if (err) return res.status(500).json({ status: "error", message: "Error writing file" });
      res.json({ status: "success", message: "Attendance recorded!" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
