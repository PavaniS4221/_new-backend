document
  .getElementById("teacher-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const teacher = {
      name: document.getElementById("name").value,
      busNumber: document.getElementById("bus-number").value,
      routeNumber: document.getElementById("route-number").value,
      phoneNumber: document.getElementById("phone-number").value,
    };

    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
    teachers.push(teacher);
    localStorage.setItem("teachers", JSON.stringify(teachers));

    alert("Teacher details submitted successfully.");
    window.location.href = "teacherdetails.html";
  });
