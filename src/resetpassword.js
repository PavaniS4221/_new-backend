document.addEventListener("DOMContentLoaded", function () {
  const passwordForm = document.getElementById("password-form");
  const newPassword = document.querySelector(
    'input[placeholder="New Password"]'
  );
  const confirmPassword = document.querySelector(
    'input[placeholder="Confirm Password"]'
  );
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";
  errorMessage.style.display = "none";
  passwordForm.appendChild(errorMessage);

  passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.textContent = "Passwords do not match!";
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
      window.location.href = "/login";
    }
  });
});
