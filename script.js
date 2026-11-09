// Course code -> full program name
const PROGRAMS = {
  BSIT: "Bachelor of Science in Information Technology",
  BSCS: "Bachelor of Science in Computer Science"
};

let jsonText = "";

// "dela cruz" -> "Dela Cruz"
function capitalize(text) {
  return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// CSV text -> array of objects keyed by the header row
function parseCSV(text) {
  const lines = text.replace(/^﻿/, "").trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).filter((line) => line.trim() !== "").map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, i) => {
      row[header] = (values[i] || "").trim();
    });
    return row;
  });
}

// Apply the data map to one CSV row
function transform(row) {
  return {
    studentId: parseInt(row.student_id, 10),
    firstName: capitalize(row.first_name),
    lastName: capitalize(row.last_name),
    program: PROGRAMS[row.course.toUpperCase()] || row.course,
    yearLevel: parseInt(row.year_level, 10),
    emailAddress: row.email.toLowerCase(),
    outstandingBalance: Number(parseFloat(row.tuition_balance).toFixed(2))
  };
}

// JSON.stringify drops trailing zeros (5000.00 -> 5000), so put the 2 decimals back
function toJSON(data) {
  return JSON.stringify(data, null, 2).replace(
    /("outstandingBalance": )(-?[\d.]+)/g,
    (match, key, num) => key + Number(num).toFixed(2)
  );
}

document.getElementById("convertBtn").addEventListener("click", () => {
  const file = document.getElementById("csvFile").files[0];
  if (!file) {
    alert("Please choose a CSV file first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const data = parseCSV(reader.result).map(transform);
    jsonText = toJSON(data);
    document.getElementById("output").textContent = jsonText;
  };
  reader.readAsText(file);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!jsonText) {
    alert("Please convert a CSV file first.");
    return;
  }

  const blob = new Blob([jsonText], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "students.json";
  link.click();
});
