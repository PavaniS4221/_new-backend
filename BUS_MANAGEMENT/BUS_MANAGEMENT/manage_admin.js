document.addEventListener("DOMContentLoaded", function () {
  const admins = JSON.parse(localStorage.getItem("admins")) || [];
  const tableBody = document.getElementById("admin-table-body");

  function renderTable() {
    tableBody.innerHTML = "";
    admins.forEach((admin, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${admin.firstName}</td>
          <td>${admin.lastName}</td>
          <td><img src="${admin.profilePic}" alt="Profile" height="50" /></td>
          <td>${admin.contact}</td>
          <td>${admin.mail}</td>
          <td>${admin.gender}</td>
          <td>${admin.adminId}</td>
          <td><button class="btn btn-danger btn-sm" onclick="removeAdmin(${index})">Remove</button></td>
        `;

      tableBody.appendChild(row);
    });
  }

  window.removeAdmin = function (index) {
    admins.splice(index, 1);
    localStorage.setItem("admins", JSON.stringify(admins));
    renderTable();
  };

  renderTable();
});
