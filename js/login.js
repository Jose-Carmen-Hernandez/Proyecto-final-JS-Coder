const formIngresar = document.getElementById("loginForm");
const inputNombre = document.getElementById("usuario");
const inputCorreo = document.getElementById("correo");
const inputClave = document.getElementById("clave");
const pMensaje = document.getElementById("mensaje");

function inicioSesion(usuarios) {
  if (!usuarios) {
    pMensaje.innerHTML = "usuario no encontrado";
    return;
  }

  let usuarioEncontrado = usuarios.find((usuario) => {
    return (
      usuario.nombre == inputNombre.value &&
      usuario.correo == inputCorreo.value &&
      usuario.password == inputClave.value
    );
  });

  if (usuarioEncontrado) {
    window.location.href = "./pages/productos.html";
  } else {
    pMensaje.innerHTML = "Usuario no encontrado";
  }
}
function recuperarLS() {
  return JSON.parse(localStorage.getItem("usuarios"));
}
const usuariosLS = recuperarLS();

formIngresar.addEventListener("submit", (evento) => {
  evento.preventDefault();
  inicioSesion(usuariosLS);
});
