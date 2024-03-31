//El array de productos fue convertido a formato json para consumirlo de forma asincrona:

//Utilizamos async await.
//declarar el array de productos'tienda' como variable global:
let tienda;

//Funcion para llamar al array 'tienda' de forma asincrona:
const getData = async (url) => {
  /*try {*/
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  console.log(datos);
  //desestructurar:
  tienda = datos.tienda; //Se asigna el valor de datos.tienda a la variable global 'tienda'.

  // Después de obtener los datos, llamar a crearHtml:
  crearHtml(tienda);
  //llamar a agregarEventos:

  agregarEventos(tienda);
  /*} catch (error) {
    console.error("Error al obtener los datos:", error);
  }*/
};

const API_URL = "../db/db.json";
getData(API_URL);

//SELECCIONAR LOS ELEMENTOS CON LOS QUE VAMOS A TRABAJAR:

const inputIngreso = document.querySelector("#ingreso"); //input ingreso
const btnSearch = document.querySelector("#btnSearch"); //boton buscar:
const btnMostrar = document.querySelector("#btnMostrar"); //boton mostrar carrito
const btnVaciarCarrito = document.querySelector("#btnQuitar"); //boton limpiar carrito
const btnPagarCarrito = document.querySelector("#btnPagar"); //boton pagar carrito
const contenedor = document.querySelector("#contenedor"); //<div> donde se almacenaran las tarjetas de forma dinamica.
const contenedorPago = document.querySelector("#contenedor-pago"); //<div> donde se muestra el total a pagar por el carrito.
//Se inicializa totalPagar en local storage con valor cero si aun no exiate. Y se llama dentro de la funcion quitarDelCarrito:
if (!localStorage.getItem("totalPagar")) {
  localStorage.setItem("totalPagar", JSON.stringify(0));
}

//array vacio. Se va llenando con los productos que elige el usuario.
const carrito = []; //carrito de compras

//FUNCIONES:

//Funcion para filtrar producto:
function filtrarProducto(arr, filtro) {
  const filtrado = arr.filter((el) => {
    return el.nombre.toLowerCase().includes(filtro.toLowerCase());
  });

  return filtrado;
}
//FUNCION AGREGAR EVENTOS:
//Evento click en los botones "Agregar" y "quitar" de las tarjetas de producto:
function agregarEventos() {
  const agregarBtns = document.querySelectorAll(".agregar-btn");
  const quitarBtns = document.querySelectorAll(".quitar-btn");

  agregarBtns.forEach((btn) => {
    btn.addEventListener("click", agregarAlCarrito);
    /* TOASTIFY*/
    btn.addEventListener("click", (event) => {
      const productoId = parseInt(event.target.getAttribute("data-id"));
      const productoSeleccionado = tienda.find(
        (producto) => producto.id === productoId
      );

      if (productoSeleccionado) {
        Toastify({
          text: `${productoSeleccionado.nombre} se agregó al carrito!`,
          duration: 1500,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "#1f561f",
          },
        }).showToast();
      }
    });
  });

  quitarBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => quitarDelCarrito(event, tienda));
  });
}

//Funcion para agregar un producto al carrito:
function agregarAlCarrito(event) {
  console.log("Agregando al carrito");
  const productoId = parseInt(event.target.getAttribute("data-id"));

  const productoSeleccionado = tienda.find(
    (producto) => producto.id === productoId
  );

  if (productoSeleccionado) {
    //verificar si el producto ya esta en el carrito:
    const existeEnCarrito = carrito.some((item) => item.id === productoId);

    if (existeEnCarrito) {
      //si ya esta en el carrito incrementa la cantidad:
      carrito.forEach((item) => {
        if (item.id === productoId) {
          item.cantidad++;
        }
      });
    } else {
      //si no esta en el carrito agregarlo con cantidad 1:
      carrito.push({ ...productoSeleccionado, cantidad: 1 });
    }

    //Despues de agregar un producto al carrito, actualizar la variable totalPagar en el almacenamiento local:
    const totalPagar = calcularPagoTotal(carrito);
    localStorage.setItem("totalPagar", JSON.stringify(totalPagar));
    //Actualizar contenido del contenedor de pago con el nuevo total:
    contenedorPago.innerHTML = `<p>Total del carrito: $${totalPagar}.00</p>`;
    //guardar carrito actualizado en LS:
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

//FUNCION PARA QUITAR UN PRODUCTO DEL CARRITO:
function quitarDelCarrito(event) {
  const productoId = parseInt(event.target.getAttribute("data-id"));
  const indice = carrito.findIndex((item) => item.id === productoId);

  if (indice !== -1) {
    //Restar el precio del producto que se quita del carrito:
    const precioRestado = carrito[indice].precio * carrito[indice].cantidad;
    let totalPagar = calcularPagoTotal(carrito);

    //Restar el precio del producto eliminado del total a pagar:
    totalPagar -= precioRestado;

    carrito.splice(indice, 1); // Elimina el producto del carrito
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el carrito en el localStorage
    crearHtml(carrito); // Vuelve a renderizar el carrito
    contenedorPago.innerHTML = `<p>Total del carrito: $${totalPagar}.00</p>`;

    localStorage.setItem("totalPagar", JSON.stringify(totalPagar)); //actualiza el total a pagar en el LS
    console.log(totalPagar);
  }
}

/*-----PRUEBA DE FUNCION PARA AJUSTAR BOTONES----- */
function crearHtml(arr) {
  contenedor.innerHTML = "";

  // La función se ejecuta solo si el array no está vacío.
  if (arr && arr.length > 0) {
    // Desestructuración del objeto en la función:
    for (const el of arr) {
      const { img, nombre, precio, id } = el;
      const estaEnCarrito = carrito.some((item) => item.id === id);
      //El precio del producto tendra 2 decimales:
      const html = `
        <div class="card">
          <img src="../img/${img}" alt="${nombre}">
          <hr>
          <h3>${nombre}</h3>
          <p>Precio: $${precio.toFixed(2)} </p>
          <div class="card-action">
            ${
              estaEnCarrito
                ? `<button class="btn btn-danger quitar-btn" data-id="${id}">Quitar</button>`
                : `<button class="btn btn-success agregar-btn" data-id="${id}">Agregar</button>`
            }
          </div>
        </div>`;

      // Agregar tarjetas al contenedor:
      contenedor.innerHTML += html;
    }
    agregarEventos(); // Agrega eventos después de crear todas las tarjetas HTML.
  } else {
    // Si no hay productos agregados al carrito, la función muestra el siguiente mensaje:
    contenedorPago.innerHTML = "";
    contenedor.innerHTML =
      "No hay productos agregados al carrito.  Haz click en 'Buscar' para ver todos nuestros productos";
  }
}

//crearHtml(tienda);

//Agregar una escucha de evento click al boton "buscar":
btnSearch.addEventListener("click", () => {
  //validar minimo 4 letras en el campo de entrada:
  if (inputIngreso.value.length >= 4) {
    const filtrado = filtrarProducto(tienda, inputIngreso.value);
    crearHtml(filtrado);
    if (filtrado.length === 0) {
      contenedor.innerHTML = "<p>No se encontraron productos</p>";
    }
  } else {
    //las tarjetas de producto se muestran aunque el usuario no realice una busqueda especifica:
    crearHtml(tienda);
  }
});

//Boton "ver carrito".
//Los productos agregados al carrito solo tienen el boton "quitar" y no se pueden agregar de nuevo dentro del carrito:
btnMostrar.addEventListener("click", () => {
  const carritoDesdeLS = JSON.parse(localStorage.getItem("carrito"));
  crearHtml(carritoDesdeLS, false); //false

  //Calcular pago:
  const total = calcularPagoTotal(carritoDesdeLS);
  contenedorPago.innerHTML = `<p>Total del carrito: $${total}.00</p>`;
  console.log(total);
});

//Agregar una escucha de evento click al boton "vaciar carrito":
btnVaciarCarrito.addEventListener("click", () => {
  //Restablecer la variable totalPagar a cero en el almacenamiento local:
  localStorage.setItem("totalPagar", JSON.stringify(0));

  //Reiniciar el estado del carrito cuando se use el boton 'vaciar carrito':
  carrito.length = 0;

  Swal.fire("El carrito esta vacío! Agrega algún producto.");
  //Limpiar el contenedor donde aparece el total a pagar:
  contenedorPago.innerHTML = "";
  //Remover el carrito del almacenamiento local:
  localStorage.removeItem("carrito");

  //mostrar las tarjetas de productos si el carrito esta vacio:
  crearHtml(tienda);
});

//Funcion  para calcular el pago total:
function calcularPagoTotal(array) {
  //Hacer el calculo solo si el carrito tiene productos agregados:
  if (array && array.length > 0) {
    return array.reduce((acc, elemento) => {
      //Si elemento.cantidad no tiene un valor, asumir 1:
      const cantidad = elemento.cantidad || 1;
      return acc + elemento.precio * cantidad;
    }, 0);
  } else {
    return 0; //Devolver 0 si el carrito esta vacio.
  }
}
// Evento click en el botón Pagar carrito:
btnPagarCarrito.addEventListener("click", () => {
  const carritoDesdeLS = JSON.parse(localStorage.getItem("carrito"));
  //Verificar si el carrito esta vacio:
  if (!carritoDesdeLS || carritoDesdeLS.length === 0) {
    //no hacer nada si el carrito esta vacio:
    return;
  }
  const total = calcularPagoTotal(carritoDesdeLS);
  //Limpiar el contenedor del total a pagar:
  contenedorPago.innerHTML = "";
  //Reiniciar el estado del carrito despues de pagar:
  carrito.length = 0;
  //Remover el carrito del almacenamiento local despues de pagar:
  localStorage.removeItem("carrito");
  //Despues de pagar, reiniciar la variable totalPagar a cero en el almacenamiento local:
  localStorage.setItem("totalPagar", JSON.stringify(0));

  Swal.fire({
    title: "Compra exitosa",
    text: `Total pagado: $${total}`,
    icon: "success",
  });
  crearHtml(tienda);
});
