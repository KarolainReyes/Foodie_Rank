document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const modalOverlay = document.getElementById("modal-overlay");

  loginBtn.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });
});


const loginBtn = document.getElementById("login-btn");
const modalOverlay = document.getElementById("modal-overlay");
const loginForm = document.getElementById("login-form");


loginBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
});


modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();


  const emailUser = loginForm.querySelector('input[type="email"]').value.trim();
  const contraseniaUser = loginForm.querySelector('input[type="password"]').value.trim();

  if (!emailUser || !contraseniaUser) {
    alert("Por favor ingresa tu correo y contraseña.");
    return;
  }

  try {

    const response = await fetch("http://localhost:4000/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailUser, contraseniaUser }),
    });

    const data = await response.json();


    if (response.ok) {

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("token", data.token || "");

      alert(`¡Bienvenido/a ${data.usuario.nombre}!`);
      modalOverlay.style.display = "none";


      loginBtn.textContent = `Hola, ${data.usuario.nombre.split(" ")[0]}!`;
      loginBtn.disabled = true;
    } else {
      alert(data.message || "Correo o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
});
