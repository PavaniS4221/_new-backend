// JavaScript to toggle sidebar visibility
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const sidebar = document.getElementById("sidebar");
const navSidebar = document.getElementById("nav-sidebar");
const navClose = document.getElementById("nav-close");
const mainContent = document.querySelector("main");

// Toggle the main sidebar
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  mainContent.classList.toggle("expanded");
});

// Close button for the main sidebar
sidebarClose.addEventListener("click", () => {
  sidebar.classList.remove("active");
  mainContent.classList.remove("expanded");
});

// Toggle the navigation sidebar
navClose.addEventListener("click", () => {
  navSidebar.classList.remove("active");
});
