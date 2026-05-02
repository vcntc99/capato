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
    data.forEach(file => {
      if (file.type === "file") {
        const img = document.createElement("img");
        img.src = file.download_url;

        img.onclick = () => {
          imgGrande.src = file.download_url;
          modal.classList.remove("hidden");
        };

        galeria.appendChild(img);
      }
    });
  });

// cerrar modal
cerrar.onclick = () => modal.classList.add("hidden");
modal.onclick = () => modal.classList.add("hidden");
