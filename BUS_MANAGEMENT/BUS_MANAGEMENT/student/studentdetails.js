document.addEventListener("DOMContentLoaded", function () {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const tableBody = document.getElementById("student-details");

  function renderTable() {
    tableBody.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.usn}</td>
        <td>${student.busNumber}</td>
        <td>${student.routeNumber}</td>
        <td>${student.year}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeStudent(${index})">Remove</button></td>
      `;

      tableBody.appendChild(row);
    });
  }

  window.removeStudent = function (index) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderTable();
  };

  renderTable();
});
