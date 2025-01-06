const profileData = {
  firstName: "admin123",
  lastName: "admin123",
  contact: "1234567890",
  mail: "123.adme@example.com",
  gender: "male",
  adminId: "ADMIN12345",
  profilePic: "profile-pic.jpg",
};
window.onload = function () {
  document.getElementById("first-name").value = profileData.firstName;
  document.getElementById("last-name").value = profileData.lastName;
  document.getElementById("contact").value = profileData.contact;
  document.getElementById("mail").value = profileData.mail;
  document.getElementById("gender").value = profileData.gender;
  document.getElementById("admin-id").value = profileData.adminId;
  document.getElementById("profile-pic").src = profileData.profilePic;
};
function saveDetails() {
  const updatedData = {
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    contact: document.getElementById("contact").value,
    mail: document.getElementById("mail").value,
    gender: document.getElementById("gender").value,
    adminId: document.getElementById("admin-id").value,
  };
  console.log("Updated Data:", updatedData);
  alert("Changes saved successfully!");
}
