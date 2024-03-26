// Llamar al formulario:
const formRegistro = document.getElementById("form-registro");
const contenedorForm = document.getElementById("cont-form");

// Primera escucha de evento submit del formulario para crear cuenta de usuario:
formRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  // Obtener valores de los campos:
  const nombre = document.getElementById("name").value;
  const correo = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Obtener usuarios del local storage o inicializar un array vacío:
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Comprobar si el correo electrónico ya está registrado:
  const usuarioExistente = usuarios.find((user) => user.correo === correo);

  // Si el usuario ya existe, mostrar un mensaje y salir de la función:
  if (usuarioExistente) {
    //Sweet alert:
    Swal.fire(
      "El correo electrónico ya está registrado. Por favor, utiliza otro."
    );
    return;
  }

  // Crear nuevo usuario:
  const nuevoUsuario = new Usuario(nombre, correo, password);
  usuarios.push(nuevoUsuario); // Agregar el nuevo usuario al array de usuarios:

  // Guardar el array actualizado en el local storage:
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Redireccionar a la página de inicio de sesión:
  window.location.href = "../index.html";
});

// Constructor de usuario:
class Usuario {
  constructor(nombre, correo, password) {
    this.nombre = nombre;
    this.correo = correo;
    this.password = password;
  }
}
