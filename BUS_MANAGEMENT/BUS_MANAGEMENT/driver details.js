document.addEventListener("DOMContentLoaded", function () {
  const drivers = JSON.parse(localStorage.getItem("drivers")) || [];
  const tableBody = document.getElementById("driver-details");

  function renderTable() {
    tableBody.innerHTML = "";
    drivers.forEach((driver, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${driver.name}</td>
        <td>${driver.busNumber}</td>
        <td>${driver.routeNumber}</td>
        <td>${driver.phoneNumber}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeDriver(${index})">Remove</button></td>
      `;

      tableBody.appendChild(row);
    });
  }

  window.removeDriver = function (index) {
    drivers.splice(index, 1);
    localStorage.setItem("drivers", JSON.stringify(drivers));
    renderTable();
  };

  renderTable();
});
