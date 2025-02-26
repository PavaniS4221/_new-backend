document.addEventListener("DOMContentLoaded", function () {
  const signinForm = document.getElementById("login-form");
  const goToSignup = document.getElementById("go-to-signup");
  const goToLogin = document.getElementById("go-to-login"); 

  if (goToSignup) {
    goToSignup.addEventListener("click", function () {
      window.location.href = "/signup"; 
    });
  }

  if (goToLogin) {
    goToLogin.addEventListener("click", function () {
      window.location.href = "/login"; 
    });
  }

  // Handle login form submission
  if (signinForm) {
    signinForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const role = document.querySelector('input[name="role"]:checked').value;

      if (role === "admin") {
        window.location.href = "/admindash";
      } else if (role === "student") {
        window.location.href = "/student-dashboard";
      } else if (role === "busincharge") {
        window.location.href = "/bus-incharge/busincharge-dashboard";
      }
    });
  }
});
