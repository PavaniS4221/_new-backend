// Bus route data
const routes = [
    { number: 1, bus: "KA50 B 0786", driver: "Nagaraju", contact: "9980325093" },
    { number: 2, bus: "KA50 A 6147", driver: "Maruthi", contact: "8861785966" },
    { number: 3, bus: "KA50 A 6140", driver: "Shashi Kumar", contact: "8431410999" },
    { number: 4, bus: "KA50 B 2445", driver: "Babu", contact: "9742653022" },
    { number: 5, bus: "KA50 A 9873", driver: "Prasanna", contact: "7259519108" },
    { number: 6, bus: "KA50 B 4232", driver: "Devendra", contact: "9242639999" },
    { number: 7, bus: "KA51 AF 2392", driver: "Nagesh", contact: "6362601443" },
    { number: 8, bus: "KA50 A 6141", driver: "Suresh", contact: "9740400326" },
    { number: 9, bus: "KA51 AF 2389", driver: "Venkataramanna", contact: "9900307089" },
    { number: 10, bus: "KA50 B 0785", driver: "Chikke Gowda", contact: "9739272895" },
    { number: 11, bus: "KA51 AF 2391", driver: "Gopal R K", contact: "9901755858" },
    { number: 12, bus: "BMTC", driver: "Ravi", contact: "9740464447" },
    { number: 13, bus: "KA30 8382", driver: "Vijay Kumar", contact: "9611729173" },
    { number: 14, bus: "BMTC", driver: "Basavaraj", contact: "9901057650" },
    { number: 15, bus: "BMTC", driver: "Srinivas", contact: "9916488736" },
    { number: 16, bus: "KA50 B 0787", driver: "Raghu", contact: "9164714304" },
    { number: 17, bus: "KA50 A 9874", driver: "Kitty", contact: "8970874543" },
    { number: 18, bus: "KA50 B 2444", driver: "Murali Naik", contact: "8985338412" },
    { number: 19, bus: "BMTC", driver: "Sukanya", contact: "9113935920" },
    { number: 21, bus: "KA51 AF 2390", driver: "Ravi Nayak", contact: "9036451860" },
    { number: 22, bus: "KA50 A 8409", driver: "Manjunatha", contact: "9945315092" },
    { number: 23, bus: "KA50 B 0789", driver: "Devaraj Naik", contact: "9740134472" },
    { number: 24, bus: "KA50 A 8408", driver: "Venkatesh", contact: "8971448687" },
    { number: 25, bus: "KA50 B 4231", driver: "Munianjenappa", contact: "9741448963" }
];

// Function to populate the route dropdown (excluding Route 20)
function populateRouteFilter() {
    const routeFilter = document.getElementById("routeFilter");
    for (let i = 1; i <= 25; i++) {
        if (i === 20) continue; // Skip route 20

        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Route ${i}`;
        routeFilter.appendChild(option);
    }
}

// Function to display routes
function displayRoutes() {
    const routesContainer = document.getElementById("routes");
    routesContainer.innerHTML = ""; // Clear existing routes

    routes.forEach(route => {
        const routeCard = document.createElement("div");
        routeCard.classList.add("route-card");
        routeCard.setAttribute("data-route", route.number);
        routeCard.innerHTML = `
            <div class="route-info">
                <i class="fas fa-bus icon"></i>
                <div>
                    <h3>Route ${route.number} - ${route.bus}</h3>
                    <p><strong>Driver:</strong> ${route.driver}</p>
                </div>
            </div>
            <p class="contact"><i class="fas fa-phone"></i> ${route.contact}</p>
        `;
        routesContainer.appendChild(routeCard);
    });
}

// Function to filter routes based on selection
function filterRoutes() {
    let selectedRoute = document.getElementById("routeFilter").value;
    let routeCards = document.querySelectorAll(".route-card");

    routeCards.forEach(card => {
        if (selectedRoute === "all" || card.getAttribute("data-route") === selectedRoute) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    populateRouteFilter();
    displayRoutes();
});

// Expose the function globally
window.filterRoutes = filterRoutes;
