// Clase "molde" para los productos de nuestra aplicación
class Producto {
  constructor(id, nombre, precio, categoria, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}

// Clase que simula la base de datos del e-commerce, acá van a estar
// todos los celulares de nuestro catálogo
class BaseDeDatos {
  constructor() {
    // Array para el catálogo
    this.productos = [];
    // Empezar a cargar productos
    this.agregarRegistro(1, "Iphone 14", 1500, "celulares", "iphone14.jpg");
    this.agregarRegistro(
      2,
      "Iphone 13 PRO",
      1300,
      "celulares",
      "iphone13PRO.jpg"
    );
    this.agregarRegistro(3, "Iphone 13", 1100, "celulares", "iphone13.webp");
    this.agregarRegistro(
      4,
      "Iphone 11 PRO",
      800,
      "celulares",
      "iphone11PRO.jpeg"
    );
    this.agregarRegistro(5, "Iphone 11", 600, "celulares", "iphone11.jpg");
    this.agregarRegistro(6, "Iphone SE", 600, "celulares", "iphoneSE.jpeg");
    this.agregarRegistro(7, "Iphone X", 450, "celulares", "iphoneX.jpg");
    this.agregarRegistro(8, "Iphone 8", 380, "celulares", "iphone8.jpg");
  }

  // Método que crea el objeto producto y lo manda en el catálogo
  agregarRegistro(id, nombre, precio, categoria, imagen) {
    const producto = new Producto(id, nombre, precio, categoria, imagen);
    this.productos.push(producto);
  }

  // Nos devuelve todo el catálogo de productos
  traerRegistros() {
    return this.productos;
  }

  // Nos devuelve un producto según el ID
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  // Nos devuelve un array con todas las coincidencias que encuentre según el
  // nombre del producto con la palabra que el pasemos como parámetro
  registrosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

// Clase carrito que nos sirve para manipular los productos de nuestro carrito
class Carrito {
  constructor() {
    // Storage JSON
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    // Aca es donde van a estar almacenados todos los productos del carrito
    this.carrito = carritoStorage || [];
    this.total = 0; // Suma total de los precios de todos los productos
    this.cantidadProductos = 0; // La cantidad de productos que tenemos en el carrito
    // Llamo a listar apenas de instancia el carrito para aplicar lo que
    // hay en el storage (en caso de que haya algo)
    this.listar();
  }

  // Método para saber si el producto está en el carrito
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  // Agregar los productos al carrito
  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    // Si no está en el carrito, hago push y le agrego
    // la propiedad "cantidad"
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      // De lo contrario, si ya está en el carrito, se suma  1 a la cantidad
      productoEnCarrito.cantidad++;
    }
    // Actualizo el storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Muestro los productos en el HTML
    this.listar();
  }

  // Quitar del carrito
  quitar(id) {
    // Obento el índice de un producto según el ID, porque el
    // método splice me pide el índice
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    // Si la cantidad es mayor a 1, le resto la cantidad en 1
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      // Y sino, borramos del carrito el producto a quitar
      this.carrito.splice(indice, 1);
    }
    // Actualizo el storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Muestro los productos en el HTML
    this.listar();
  }

  // Renderiza todos los productos en el HTML
  listar() {
    // Reiniciamos variables
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";
    // Recorro producto por producto del carrito, y los dibujo en el HTML
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
            <div class="productoCarrito card" style="width: 18rem;">
            <img src="./images/${producto.imagen}" class="card-img-top" alt="iphones">
              <h2>${producto.nombre}</h2>
              <p>US$: ${producto.precio}</p>
              <p>Cantidad: ${producto.cantidad}</p>
              <a href="#" class="btnQuitar btn btn-danger" data-id="${producto.id}">Quitar del carrito</a>

            </div>
          `;
      // Actualizamos los totales
      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }
    // Como no se cuantos productos tengo en el carrito, debo
    // asignarle los eventos de forma dinámica a cada uno
    // Primero hago una lista de todos los botones con .querySelectorAll
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    // Después los recorro uno por uno y les asigno el evento a cada uno
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        // Obtengo el id por el dataset (está asignado en this.listar())
        const idProducto = Number(boton.dataset.id);
        // Llamo al método quitar pasándole el ID del producto
        this.quitar(idProducto);
      });
    }
    // Actualizo los contadores del HTML
    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

// Instanciamos la base de datos
const bd = new BaseDeDatos();

// Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");

// Instaciamos la clase Carrito
const carrito = new Carrito();

// Mostramos el catálogo de la base de datos apenas carga la página
cargarProductos(bd.traerRegistros());

// Función para mostrar para renderizar productos del catálogo o buscador
function cargarProductos(productos) {
  // Vacíamos el div
  divProductos.innerHTML = "";
  // Recorremos producto por producto y lo dibujamos en el HTML
  for (const producto of productos) {
    divProductos.innerHTML += `
    <div class="card" style="width: 18rem;">
    <img src="./images/${producto.imagen}" class="card-img-top" alt="iphones">
    <div class="card-body">
      <h5 class="card-title">${producto.nombre}</h5>
      <p class="card-text precio">US$: ${producto.precio}</p>
      <a href="#" class="btnAgregar btn btn-primary" data-id="${producto.id}">Agregar al carrito</a>
    </div>
  </div>
    `;
  }

  // Lista dinámica con todos los botones que haya en nuestro catálogo
  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  // Recorremos botón por botón de cada producto en el catálogo y le agregamos
  // el evento click a cada uno
  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      // Evita el comportamiento default de HTML
      event.preventDefault();
      // Guardo el dataset ID que está en el HTML del botón Agregar al carrito
      const idProducto = Number(boton.dataset.id);
      // Uso el método de la base de datos para ubicar el producto según el ID
      const producto = bd.registroPorId(idProducto);
      // Llama al método agregar del carrito
      carrito.agregar(producto);
    });
  }
}

// Buscador
inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const productos = bd.registrosPorNombre(palabra);
  cargarProductos(productos);
});

// Toggle para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});
