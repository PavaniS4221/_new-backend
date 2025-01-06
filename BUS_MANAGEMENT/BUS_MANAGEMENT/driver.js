document
  .getElementById("driverForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const driverDetails = {
      name: document.getElementById("driverName").value,
      routeNumber: document.getElementById("routeNumber").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      license: document.getElementById("license").value,
      busNumber: document.getElementById("busNumber").value,
    };

    const photoFile = document.getElementById("driverPhoto").files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      driverDetails.photo = e.target.result;
      let allDrivers = JSON.parse(localStorage.getItem("allDrivers")) || [];
      allDrivers.push(driverDetails);
      localStorage.setItem("allDrivers", JSON.stringify(allDrivers));
      displayDriverDetails(driverDetails);
    };
    reader.readAsDataURL(photoFile);
  });

function displayDriverDetails(driverDetails) {
  document.getElementById("displayDriverName").innerText = driverDetails.name;
  document.getElementById("displayDriverPhoto").src = driverDetails.photo;
  document.getElementById("displayRouteNumber").innerText =
    driverDetails.routeNumber;
  document.getElementById("displayPhoneNumber").innerText =
    driverDetails.phoneNumber;
  document.getElementById("displayLicense").innerText = driverDetails.license;
  document.getElementById("displayBusNumber").innerText =
    driverDetails.busNumber;
  document.getElementById("driverDetails").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const allDrivers = JSON.parse(localStorage.getItem("allDrivers")) || [];
  if (allDrivers.length > 0) {
    displayDriverDetails(allDrivers[allDrivers.length - 1]);
  }
});
