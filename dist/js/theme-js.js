const themeBtns = document.querySelectorAll(".theme-btn");

let theme = localStorage.getItem("theme");

if (theme == null) {
  setTheme("white-mode");
} else {
  setTheme(theme);
}

themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let mode = btn.getAttribute("data-mode");
    setTheme(mode);
  });
});

function setTheme(mode) {
  if (mode === "white-mode") {
    document.getElementById("theme-style").href = "./dist/css/default.css";
  }
  if (mode === "black-mode") {
    document.getElementById("theme-style").href = "./dist/css/main.css";
  }

  localStorage.setItem("theme", mode);
}
