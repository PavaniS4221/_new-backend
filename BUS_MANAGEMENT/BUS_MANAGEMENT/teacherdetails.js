document.addEventListener("DOMContentLoaded", function () {
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  const tableBody = document.getElementById("teacher-details");

  function renderTable() {
    tableBody.innerHTML = "";
    teachers.forEach((teacher, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${teacher.name}</td>
        <td>${teacher.busNumber}</td>
        <td>${teacher.routeNumber}</td>
        <td>${teacher.phoneNumber}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeTeacher(${index})">Remove</button></td>
      `;

      tableBody.appendChild(row);
    });
  }

  window.removeTeacher = function (index) {
    teachers.splice(index, 1);
    localStorage.setItem("teachers", JSON.stringify(teachers));
    renderTable();
  };

  renderTable();
});
