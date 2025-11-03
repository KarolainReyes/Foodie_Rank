async function obtenerUsuarioId() {
  try {
    const response = await fetch("https://foodie-rank-backend.onrender.com/usuarios/logged/id", {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok && data.exito) {
      // Guardar en localStorage
      localStorage.setItem("usuarioId", data.usuarioId);
      localStorage.setItem("usuario", JSON.stringify({
        _id: data.usuarioId,
        nombre: data.nombre,
        rol: data.rol
      }));

      console.log("Usuario guardado:", data);
    } else {
      console.error("No se pudo obtener el usuario:", data.mensaje);
    }
  } catch (error) {
    console.error("Error al obtener usuario:", error);
  }
}
