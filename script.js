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

// Escribe aquí el número de WhatsApp que recibirá
// las consultas de los clientes.
//
// Formato:
// México: 52 + número de 10 dígitos
//
// SIN:
// +
// espacios
// guiones
//
// Ejemplo:
// const telefonoWhatsApp = "525512345678";

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


  // ----------------------------------------------------
  // Crear enlace directo al producto
  // ----------------------------------------------------

  const enlaceProducto =
    `${window.location.origin}${window.location.pathname}?producto=${encodeURIComponent(producto.codigo)}`;


  // ----------------------------------------------------
  // Configurar botón de WhatsApp
  // ----------------------------------------------------

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


    // Abrir WhatsApp
    window.open(urlWhatsApp, "_blank");

  };


  // ----------------------------------------------------
  // Abrir ventana
  // ----------------------------------------------------

  modal.classList.remove("hidden");

}


// ======================================================
// CARGAR PRODUCTOS
// ======================================================

fetch("productos.json")

  .then(res => res.json())

  .then(productos => {

    // --------------------------------------------------
    // Cargar imágenes desde GitHub
    // --------------------------------------------------

    return fetch(url)

      .then(res => res.json())

      .then(data => {

        if (!Array.isArray(data)) {

          galeria.innerHTML =
            "Error cargando imágenes";

          return;

        }


        // ==================================================
        // ORDENAR IMÁGENES POR NÚMERO
        // ==================================================

        data.sort((a, b) => {

          const numeroA =
            parseInt(
              a.name.match(/^\d+/)?.[0] || "999999",
              10
            );


          const numeroB =
            parseInt(
              b.name.match(/^\d+/)?.[0] || "999999",
              10
            );


          if (numeroA !== numeroB) {

            return numeroA - numeroB;

          }


          return a.name.localeCompare(b.name);

        });


        // ==================================================
        // CREAR GALERÍA
        // ==================================================

        data.forEach(file => {

          // Solo procesar archivos
          if (
            file.type === "file" &&
            file.download_url
          ) {

            // ----------------------------------------------
            // Buscar los datos del producto
            // ----------------------------------------------

            const producto =
              productos.find(
                p => p.imagen === file.name
              );


            // Si no existe información del producto,
            // no mostramos la imagen.
            if (!producto) {

              return;

            }


            // ----------------------------------------------
            // Crear imagen
            // ----------------------------------------------

            const img =
              document.createElement("img");


            img.src =
              file.download_url;


            img.alt =
              producto.nombre;


            // ----------------------------------------------
            // Cuando hacen clic en la imagen
            // ----------------------------------------------

            img.onclick = () => {

              abrirProducto(
                producto,
                file.download_url
              );

            };


            // ----------------------------------------------
            // Agregar imagen a la galería
            // ----------------------------------------------

            galeria.appendChild(img);

          }

        });


        // ==================================================
        // ABRIR PRODUCTO DESDE UN ENLACE DIRECTO
        // ==================================================

        const parametros =
          new URLSearchParams(
            window.location.search
          );


        const codigoSolicitado =
          parametros.get("producto");


        // Si la URL contiene ?producto=...
        if (codigoSolicitado) {

          // Buscar producto por código
          const productoSolicitado =
            productos.find(
              p => p.codigo === codigoSolicitado
            );


          // Si encontramos el producto
          if (productoSolicitado) {

            // Buscar su imagen
            const archivoImagen =
              data.find(
                file =>
                  file.name === productoSolicitado.imagen
              );


            // Si encontramos la imagen
            if (
              archivoImagen &&
              archivoImagen.download_url
            ) {

              // Abrir automáticamente
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

    console.error("Error:", err);

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
// EVITAR QUE EL CLIC DENTRO DEL MODAL LO CIERRE
// ======================================================

contenidoModal.onclick = (event) => {

  event.stopPropagation();

};
