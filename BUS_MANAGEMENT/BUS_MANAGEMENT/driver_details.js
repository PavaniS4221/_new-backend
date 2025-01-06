document.addEventListener("DOMContentLoaded", function () {
  displayAllDrivers();
});

function displayAllDrivers() {
  const allDrivers = JSON.parse(localStorage.getItem("allDrivers")) || [];
  const allDriversContainer = document.getElementById("allDrivers");
  allDriversContainer.innerHTML = "";

  allDrivers.forEach((driver) => {
    const driverCard = document.createElement("div");
    driverCard.className = "col-md-4";
    driverCard.innerHTML = `
            <div class="card">
              <div class="card-body">
                <p><strong>Name:</strong> ${driver.name}</p>
                <p><strong>Photo:</strong>
                  <img src="${driver.photo}" alt="Driver Photo" style="max-width: 100px;" />
                </p>
                <p><strong>Route Number:</strong> ${driver.routeNumber}</p>
                <p><strong>Phone Number:</strong> ${driver.phoneNumber}</p>
                <p><strong>License:</strong> ${driver.license}</p>
                <p><strong>Bus Number:</strong> ${driver.busNumber}</p>
              </div>
            </div>
          `;
    allDriversContainer.appendChild(driverCard);
  });
}

function filterDrivers() {
  const routeFilter = document.getElementById("routeFilter").value;
  const allDrivers = JSON.parse(localStorage.getItem("allDrivers")) || [];
  const filteredDrivers = allDrivers.filter(
    (driver) => driver.routeNumber === routeFilter
  );
  const allDriversContainer = document.getElementById("allDrivers");
  allDriversContainer.innerHTML = "";

  filteredDrivers.forEach((driver) => {
    const driverCard = document.createElement("div");
    driverCard.className = "col-md-4";
    driverCard.innerHTML = `
            <div class="card">
              <div class="card-body">
                <p><strong>Name:</strong> ${driver.name}</p>
                <p><strong>Photo:</strong>
                  <img src="${driver.photo}" alt="Driver Photo" style="max-width: 100px;" />
                </p>
                <p><strong>Route Number:</strong> ${driver.routeNumber}</p>
                <p><strong>Phone Number:</strong> ${driver.phoneNumber}</p>
                <p><strong>License:</strong> ${driver.license}</p>
                <p><strong>Bus Number:</strong> ${driver.busNumber}</p>
              </div>
            </div>
          `;
    allDriversContainer.appendChild(driverCard);
  });
}
