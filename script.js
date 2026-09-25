// ======================================================
// CONFIGURACIÓN DEL CATÁLOGO
// ======================================================

const usuario = "vcntc99";
const repo = "capato";
const carpeta = "image";

const url =
  `https://api.github.com/repos/${usuario}/${repo}/contents/${carpeta}`;


// ======================================================
// NÚMERO DE WHATSAPP
// ======================================================

// Formato internacional.
// México: 52 + 10 dígitos
// Sin +, espacios ni guiones.

const telefonoWhatsApp = "525535000789";


// ======================================================
// ELEMENTOS DE LA PÁGINA
// ======================================================

const galeria =
  document.getElementById("galeria");

const modal =
  document.getElementById("modal");

const contenidoModal =
  document.getElementById("contenidoModal");

const imgGrande =
  document.getElementById("imgGrande");

const cerrar =
  document.getElementById("cerrar");

const nombreProducto =
  document.getElementById("nombreProducto");

const descripcionProducto =
  document.getElementById("descripcionProducto");

const precioProducto =
  document.getElementById("precioProducto");

const categoriaProducto =
  document.getElementById("categoriaProducto");

const marcaProducto =
  document.getElementById("marcaProducto");

const codigoProducto =
  document.getElementById("codigoProducto");

const whatsappProducto =
  document.getElementById("whatsappProducto");


// ======================================================
// FILTROS
// ======================================================

const botonesFiltro =
  document.querySelectorAll(".filtro");


// ======================================================
// VARIABLES DEL CATÁLOGO
// ======================================================

// Aquí guardaremos todos los productos.

let productos = [];


// Aquí guardaremos las imágenes disponibles.

let archivosImagenes = [];


// Categoría actualmente seleccionada.

let categoriaActual = "Todos";


// ======================================================
// FUNCIÓN PARA ABRIR UN PRODUCTO
// ======================================================

function abrirProducto(producto, imagenUrl) {

  // ----------------------------------------------------
  // Mostrar imagen
  // ----------------------------------------------------

  imgGrande.src = imagenUrl;

  imgGrande.alt = producto.nombre;


  // ----------------------------------------------------
  // Mostrar información
  // ----------------------------------------------------

  nombreProducto.textContent =
    producto.nombre;

  descripcionProducto.textContent =
    producto.descripcion;

  precioProducto.textContent =
    `$${Number(producto.precio).toFixed(2)}`;

  categoriaProducto.textContent =
    producto.categoria;

  marcaProducto.textContent =
    producto.marca;

  codigoProducto.textContent =
    producto.codigo;


  // ====================================================
  // CREAR ENLACE DIRECTO AL PRODUCTO
  // ====================================================

  const enlaceProducto =
    `${window.location.origin}${window.location.pathname}?imagen=${encodeURIComponent(producto.imagen)}`;

  const copiarEnlaceProducto =
  document.getElementById("copiarEnlaceProducto");
  
  // ====================================================
  // CONFIGURAR WHATSAPP
  // ====================================================

  whatsappProducto.onclick = () => {

    const mensaje =
      `Hola, me interesa este producto:\n\n` +

      `Producto: ${producto.nombre}\n` +

      `Código: ${producto.codigo}\n` +

      `Precio: $${Number(producto.precio).toFixed(2)}\n\n` +

      `¿Me puedes dar más información?\n\n` +

      `Producto en el catálogo:\n` +

      `${enlaceProducto}`;


    const urlWhatsApp =
      `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;


    window.open(
      urlWhatsApp,
      "_blank"
    );

  };


  // ----------------------------------------------------
  // Abrir modal
  // ----------------------------------------------------

  modal.classList.remove("hidden");

}


// ======================================================
// MOSTRAR PRODUCTOS
// ======================================================

function mostrarProductos() {

  // Limpiar galería

  galeria.innerHTML = "";


  // ----------------------------------------------------
  // Filtrar productos
  // ----------------------------------------------------

  let productosFiltrados;


  if (categoriaActual === "Todos") {

    productosFiltrados =
      productos;

  } else {

    productosFiltrados =
      productos.filter(
        producto =>
          producto.categoria === categoriaActual
      );

  }


  // ----------------------------------------------------
  // Crear galería
  // ----------------------------------------------------

  archivosImagenes.forEach(file => {

    // Buscar información del producto

    const producto =
      productosFiltrados.find(
        p => p.imagen === file.name
      );


    // Si esta imagen no pertenece a la categoría
    // seleccionada, no la mostramos.

    if (!producto) {

      return;

    }


    // --------------------------------------------------
    // Crear imagen
    // --------------------------------------------------

    const img =
      document.createElement("img");


    img.src =
      file.download_url;

    img.alt =
      producto.nombre;


    // --------------------------------------------------
    // Abrir producto
    // --------------------------------------------------

    img.onclick = () => {

      abrirProducto(
        producto,
        file.download_url
      );

    };


    // --------------------------------------------------
    // Agregar a la galería
    // --------------------------------------------------

    galeria.appendChild(img);

  });


  // ----------------------------------------------------
  // Si no hay productos
  // ----------------------------------------------------

  if (
    productosFiltrados.length === 0
  ) {

    galeria.innerHTML =
      "<p>No hay productos en esta categoría.</p>";

  }

}


// ======================================================
// ACTIVAR FILTROS
// ======================================================

botonesFiltro.forEach(boton => {

  boton.addEventListener(
    "click",
    () => {

      // -----------------------------------------------
      // Obtener categoría seleccionada
      // -----------------------------------------------

      categoriaActual =
        boton.dataset.categoria;


      // -----------------------------------------------
      // Quitar estado activo de todos
      // -----------------------------------------------

      botonesFiltro.forEach(
        b => b.classList.remove("activo")
      );


      // -----------------------------------------------
      // Activar únicamente el seleccionado
      // -----------------------------------------------

      boton.classList.add("activo");


      // -----------------------------------------------
      // Mostrar productos
      // -----------------------------------------------

      mostrarProductos();

    }
  );

});


// ======================================================
// CARGAR PRODUCTOS
// ======================================================

fetch("productos.json")

  .then(res => res.json())

  .then(dataProductos => {

    // Guardar productos

    productos =
      dataProductos;


    // --------------------------------------------------
    // Cargar imágenes desde GitHub
    // --------------------------------------------------

    return fetch(url)

      .then(res => res.json())

      .then(dataImagenes => {

        if (
          !Array.isArray(dataImagenes)
        ) {

          galeria.innerHTML =
            "Error cargando imágenes";

          return;

        }


        // ==================================================
        // ORDENAR IMÁGENES POR NÚMERO
        // ==================================================

        dataImagenes.sort(
          (a, b) => {

            const numeroA =
              parseInt(
                a.name.match(/^\d+/)?.[0]
                || "999999",
                10
              );


            const numeroB =
              parseInt(
                b.name.match(/^\d+/)?.[0]
                || "999999",
                10
              );


            if (
              numeroA !== numeroB
            ) {

              return numeroA - numeroB;

            }


            return a.name.localeCompare(
              b.name
            );

          }
        );


        // Guardar imágenes

        archivosImagenes =
          dataImagenes;


        // ==================================================
        // MOSTRAR TODOS LOS PRODUCTOS AL INICIO
        // ==================================================

        mostrarProductos();


        // ==================================================
        // ABRIR PRODUCTO DESDE ENLACE DIRECTO
        // ==================================================

        const parametros =
          new URLSearchParams(
            window.location.search
          );


        const imagenSolicitada =
          parametros.get("imagen");


        if (
          imagenSolicitada
        ) {

          const productoSolicitado =
            productos.find(
              p =>
                p.imagen ===
                imagenSolicitada
            );


          if (
            productoSolicitado
          ) {

            const archivoImagen =
              archivosImagenes.find(
                file =>
                  file.name ===
                  productoSolicitado.imagen
              );


            if (
              archivoImagen &&
              archivoImagen.download_url
            ) {

              abrirProducto(
                productoSolicitado,
                archivoImagen.download_url
              );

            }

          }

        }

      });

  })

  .catch(err => {

    console.error(
      "Error:",
      err
    );


    galeria.innerHTML =
      "No se pudieron cargar los productos";

  });


// ======================================================
// CERRAR MODAL CON LA X
// ======================================================

cerrar.onclick = () => {

  modal.classList.add("hidden");

};


// ======================================================
// CERRAR MODAL AL HACER CLIC FUERA
// ======================================================

modal.onclick = () => {

  modal.classList.add("hidden");

};


// ======================================================
// EVITAR CIERRE DENTRO DEL MODAL
// ======================================================

contenidoModal.onclick = (
  event
) => {

  event.stopPropagation();

};
