document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");
  const signinForm = document.getElementById("signin-form");
  const switchToSignin = document.getElementById("switch-to-signin");
  const switchToSignup = document.getElementById("switch-to-signup");
  const title = document.getElementById("title");

  switchToSignin.onclick = function () {
    signupForm.classList.remove("active-form");
    signinForm.classList.add("active-form");
    title.innerHTML = "Sign In";
  };

  switchToSignup.onclick = function () {
    signinForm.classList.remove("active-form");
    signupForm.classList.add("active-form");
    title.innerHTML = "Sign Up";
  };

  signinForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const role = document.querySelector('input[name="role"]:checked').value;
    if (role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else if (role === "student") {
      window.location.href = "index.html";
    }
  });

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    alert("Sign-up successful!");
  });
});
