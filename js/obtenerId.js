async function obtenerUsuarioId() {
  try {
    const response = await fetch("http://localhost:4000/usuarios/logged/id", {
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
