const usuario = "vcntc99";
const repo = "capato";
const carpeta = "image";

const url = `https://api.github.com/repos/${usuario}/${repo}/contents/${carpeta}`;

const galeria = document.getElementById("galeria");
const modal = document.getElementById("modal");
const contenidoModal = document.getElementById("contenidoModal");

const imgGrande = document.getElementById("imgGrande");
const cerrar = document.getElementById("cerrar");

const nombreProducto = document.getElementById("nombreProducto");
const descripcionProducto = document.getElementById("descripcionProducto");
const precioProducto = document.getElementById("precioProducto");
const categoriaProducto = document.getElementById("categoriaProducto");
const marcaProducto = document.getElementById("marcaProducto");
const codigoProducto = document.getElementById("codigoProducto");


// ======================================================
// CARGAR PRODUCTOS
// ======================================================

fetch("productos.json")
  .then(res => res.json())
  .then(productos => {

    // Cargar imágenes desde GitHub
    return fetch(url)
      .then(res => res.json())
      .then(data => {

        if (!Array.isArray(data)) {
          galeria.innerHTML = "Error cargando imágenes";
          return;
        }


        // ======================================================
        // ORDENAR IMÁGENES POR EL NÚMERO AL INICIO DEL NOMBRE
        // ======================================================

        data.sort((a, b) => {

          const numeroA = parseInt(
            a.name.match(/^\d+/)?.[0] || "999999",
            10
          );

          const numeroB = parseInt(
            b.name.match(/^\d+/)?.[0] || "999999",
            10
          );

          if (numeroA !== numeroB) {
            return numeroA - numeroB;
          }

          return a.name.localeCompare(b.name);

        });


        // ======================================================
        // CREAR GALERÍA
        // ======================================================

        data.forEach(file => {

          if (file.type === "file" && file.download_url) {

            // Buscar los datos correspondientes a esta imagen
            const producto = productos.find(
              p => p.imagen === file.name
            );

            // Si no hay información del producto,
            // no mostrar la imagen
            if (!producto) {
              return;
            }


            // Crear imagen
            const img = document.createElement("img");

            img.src = file.download_url;
            img.alt = producto.nombre;


            // ==================================================
            // CUANDO EL USUARIO HACE CLIC EN LA IMAGEN
            // ==================================================

            img.onclick = () => {

              // Mostrar imagen grande
              imgGrande.src = file.download_url;
              imgGrande.alt = producto.nombre;


              // Mostrar nombre
              nombreProducto.textContent = producto.nombre;


              // Mostrar descripción
              descripcionProducto.textContent =
                producto.descripcion;


              // Mostrar precio
              precioProducto.textContent =
                `$${Number(producto.precio).toFixed(2)}`;


              // Mostrar categoría
              categoriaProducto.textContent =
                producto.categoria;


              // Mostrar marca
              marcaProducto.textContent =
                producto.marca;


              // Mostrar código
              codigoProducto.textContent =
                producto.codigo;


              // Abrir modal
              modal.classList.remove("hidden");

            };


            // Agregar imagen a la galería
            galeria.appendChild(img);

          }

        });

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
// CERRAR MODAL HACIENDO CLIC FUERA DEL CONTENIDO
// ======================================================

modal.onclick = () => {

  modal.classList.add("hidden");

};


// Evitar que un clic sobre el contenido
// cierre accidentalmente la ventana

contenidoModal.onclick = (event) => {

  event.stopPropagation();

};
