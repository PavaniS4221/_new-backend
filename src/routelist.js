document.getElementById('routeFilter').addEventListener('change', function () {
    const selectedRoute = this.value;
    const allRoutes = document.querySelectorAll('.route-section');
    const allHrTags = document.querySelectorAll('hr');

    allRoutes.forEach(route => {
        if (selectedRoute === 'all') {
            route.style.display = 'block'; // Show all routes
        } else {
            route.style.display = route.classList.contains(selectedRoute) ? 'block' :
                'none'; // Show only the selected route
        }
    });

    // Hide or show hr tags based on filtering
    if (selectedRoute === 'all') {
        allHrTags.forEach(hr => hr.style.display = 'block'); // Show hr tags when all routes are visible
    } else {
        allHrTags.forEach(hr => hr.style.display = 'none'); // Hide hr tags when only one route is visible
    }
});
