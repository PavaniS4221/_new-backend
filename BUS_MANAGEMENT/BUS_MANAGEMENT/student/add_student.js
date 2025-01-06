document
  .getElementById("student-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const student = {
      name: document.getElementById("name").value,
      usn: document.getElementById("usn").value,
      busNumber: document.getElementById("bus-number").value,
      routeNumber: document.getElementById("route-number").value,
      year: document.getElementById("year").value,
    };

    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    alert("Student details submitted successfully.");
    window.location.href = "studentdetails.html";
  });
