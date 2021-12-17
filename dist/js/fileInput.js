// const inpFile = document.getElementById("inptFile");
const inpFile = document.querySelector(".inptFile");
const previewContainer = document.getElementById("imagePreview");
const previewImage = document.querySelector(".image-preview__image");
const previewText = document.querySelector(".image-preview__default-text");

inpFile.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    previewText.style.display = "none";
    previewImage.style.display = "block";

    reader.addEventListener("load", function () {
      console.log(this);
      previewImage.setAttribute("src", this.result);
    });

    reader.readAsDataURL(file);
  } else {
    // console.log('junior');
    previewText.style.display = null;
    previewImage.style.display = null;

    previewImage.setAttribute("src", "");
  }
});
