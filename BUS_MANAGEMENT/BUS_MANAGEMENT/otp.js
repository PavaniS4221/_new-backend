document.addEventListener("DOMContentLoaded", function () {
  const otpInputs = document.querySelectorAll("#otp-form .input-field input");

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].disabled = false;
        otpInputs[index + 1].focus();
      }
    });
  });

  window.verifyOTP = function () {
    window.location.href = "resetpassword.html";
  };
});
