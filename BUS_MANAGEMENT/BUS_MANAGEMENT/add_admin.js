document
  .getElementById("admin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const admin = {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      profilePic: document.getElementById("profile-pic").value,
      contact: document.getElementById("contact").value,
      mail: document.getElementById("mail").value,
      gender: document.getElementById("gender").value,
      adminId: document.getElementById("admin-id").value,
    };

    let admins = JSON.parse(localStorage.getItem("admins")) || [];
    admins.push(admin);
    localStorage.setItem("admins", JSON.stringify(admins));

    alert("Admin details submitted successfully.");
    window.location.href = "manage_admin.html";
  });
