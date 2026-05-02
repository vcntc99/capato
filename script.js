const usuario = "vcntc99";
const repo = "capato";
const carpeta = "image";

const url = `https://api.github.com/repos/${usuario}/${repo}/contents/${carpeta}`;

const galeria = document.getElementById("galeria");
const modal = document.getElementById("modal");
const imgGrande = document.getElementById("imgGrande");
const cerrar = document.getElementById("cerrar");

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data); // 👈 IMPORTANTE para ver qué llega

    if (!Array.isArray(data)) {
      galeria.innerHTML = "Error cargando imágenes";
      return;
    }

    data.forEach(file => {
      if (file.type === "file" && file.download_url) {
        const img = document.createElement("img");
        img.src = file.download_url;

        img.onclick = () => {
          imgGrande.src = file.download_url;
          modal.classList.remove("hidden");
        };

        galeria.appendChild(img);
      }
    });
  })
  .catch(err => {
    console.error("Error:", err);
    galeria.innerHTML = "No se pudieron cargar las imágenes";
  });

// cerrar modal
cerrar.onclick = () => modal.classList.add("hidden");
modal.onclick = () => modal.classList.add("hidden");
