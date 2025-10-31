document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    username: "Andresitogai1234",
    email: "Andresitogai1234@gmail.com",
    reviews: 0,
  };

  document.getElementById("userName").textContent = userData.username;
  document.getElementById("username").value = userData.username;
  document.getElementById("correo").value = userData.email;
  document.getElementById("reviewCount").textContent = userData.reviews;

  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", () => {
    alert("Cambios guardados correctamente.");
  });
});
