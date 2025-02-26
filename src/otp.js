function moveToNext(input, nextIndex) {
  const inputs = document.querySelectorAll(".input-field input");
  if (input.value.length === 1 && nextIndex < inputs.length) {
    inputs[nextIndex].removeAttribute("disabled");
    inputs[nextIndex].focus();
  }
}

document.getElementById("otp-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  const inputs = document.querySelectorAll(".input-field input");
  
  // Check if all inputs are filled
  for (let input of inputs) {
    if (input.value === "") {
      alert("Please enter all OTP digits.");
      return;
    }
  }

  // Redirect to reset password page
  alert("OTP Verified!");
  window.location.href = "/resetpassword";
});
