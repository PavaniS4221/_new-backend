document
  .getElementById("driver-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const driver = {
      name: document.getElementById("name").value,
      busNumber: document.getElementById("bus-number").value,
      routeNumber: document.getElementById("route-number").value,
      phoneNumber: document.getElementById("phone-number").value,
    };

    let drivers = JSON.parse(localStorage.getItem("drivers")) || [];
    drivers.push(driver);
    localStorage.setItem("drivers", JSON.stringify(drivers));

    alert("Driver details submitted successfully.");
    window.location.href = "driver details.html";
  });
