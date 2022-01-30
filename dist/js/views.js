const url = "https://emmanuel-brand.herokuapp.com/api/v1/articles";
const urlc = "https://emmanuel-brand.herokuapp.com/api/v1/comments";
const urlq = "https://emmanuel-brand.herokuapp.com/api/v1/queries";
const urld = "https://emmanuel-brand.herokuapp.com/api/v1/dashboard";

const createAndEditForm = document.querySelector("#blog-create-edit");
const logoutBtn = document.querySelector(".user-logout");
const dashboardBtn = document.querySelector(".user-dashboard");
const dashboardData = document.querySelector("section .dashboard--container");
const dashboardSection = document.querySelector("section.dashboard-sec");
const dashboardText = document.querySelectorAll(".dashboardText");
const dashboardCards = document.querySelector("#dashboard-cards");
const createNewArticleBtn = document.querySelector(".dashboard--create-btn");
const updateNewArticleBtn = document.querySelector(".dashboard--update-btn");
const loadMoreBtn = document.querySelector("#load-more");
const updateAndCreateContainer = document.querySelector(
  ".dashboard-new-design"
);
const backDashboardBtn = document.querySelector(".back-btn-dash");

const articleForm = document.querySelector("form.dashboard--container");
const dashboardCreateContainer = document.querySelector(
  ".dashboard-new-design"
);

// file input references
const inpFile = document.querySelector("#inptFile");
const previewContainer = document.getElementById("imagePreview");
const previewImage = document.querySelector(".image-preview__image");
const previewText = document.querySelector(".image-preview__default-text");
var imagePreview = document.getElementById("image-preview__image");
let imgURL = "";

var input = document.createElement("input");
var reader = new FileReader();
input.type = "file";
let files = [];
let article_to_read_id = [];
// End of file references

fetch(url)
  .then((res) => res.json())
  .then((data) => data.articles)
  .then((dats) => {
    dats.forEach((dat) => {
      const card = `
            <div class="card">
              <img
                src="${dat.article_photos[0]}"
                alt="Card image"
                class="card--img"
              />
              <p class="primary--text dashboardText">
                ${dat.summary}
              </p>
              <div class="btn-types">
                <button class="btn btn__read read-article-btn" data-id="${dat._id}">Read</button>
                <button class="btn btn__edit edit-article" id="edit-article-req-btn" data-id="${dat._id}" data-name="${dat.articleTitle}"
                  >Edit</button
                >
                <button class="btn btn__delete" id="edit-article-req-btn">Delete</button>
              </div>
              <div class="card__confirm-delete">
                <h6 class="secondary--text">Are you sure about deleting????</h6>
                <div>
                  <button data-id="${dat._id}" data-name="${dat.articleTitle}"  class="btn__delete btn">Delete</button>
                  <button class="btn btn__create">Cancel</button>
                </div>
              </div>
            </div>
        `;
      dashboardCards.innerHTML += card;
      const card_t = dashboardCards.querySelectorAll(".card");
      cardListFunc(card_t);
    });
  })
  .catch((err) => {
    console.log(err);
  });

function cardListFunc(cardList) {
  cardList.forEach((card) => {
    const deleteBtn = card.querySelector(".btn__delete");
    const cardConfirm = card.querySelector(".card__confirm-delete");
    const cancelBtn = cardConfirm.querySelector(".btn__create");
    const deleteConfirmBtn = cardConfirm.querySelector(".btn__delete");
    const editBtn = card.querySelector(".edit-article");
    const readArticleBtn = card.querySelector(".read-article-btn");

    const cookie = Cookies.get("jwt");
    if (cookie) {
      deleteBtn.style.display = "block";
      editBtn.style.display = "block";
      deleteConfirmBtn.style.display = "block";
      deleteConfirmBtn.classList.add("active");
    } else {
      deleteBtn.style.display = "none";
      editBtn.style.display = "none";
    }

    deleteBtn.addEventListener("click", () => {
      cardConfirm.classList.add("active");
    });
    cancelBtn.addEventListener("click", () => {
      cardConfirm.classList.remove("active");
    });
    deleteConfirmBtn.addEventListener("click", (e) => {
      let id = e.target.getAttribute("data-id");
      let imgName = e.target.getAttribute("data-name").split(".")[0];
      const token = getCookie("jwt");
      deleteData(token, id);
      card.classList.add("remove");
    });

    readArticleBtn.addEventListener("click", (e) => {
      let id = e.target.getAttribute("data-id");
      article_to_read_id.push(id);
      sessionStorage.setItem(
        "Article_to_read",
        JSON.stringify(article_to_read_id)
      );
      localStorage.setItem(
        "Article_to_read",
        JSON.stringify(article_to_read_id)
      );
      window.location = "./articles.html?" + id;
    });

    editBtn.addEventListener("click", (e) => {
      console.log(e, "clicked");
      updateAndCreateContainer.classList.add("active");
      let id = e.target.getAttribute("data-id");
      let articleName = e.target.getAttribute("data-name").split(".")[0];
      articleForm.classList.add("updating");
      const updateBtn = articleForm["dashboard--update-btn"];
      updateBtn.innerHTML = "Update Article";
      glabFormData(id);
      submitFormFunc(true, id, articleName);
    });
  });
}
function updateData(token, data, id) {
  const formData = new FormData();
  formData.append("articleTitle", data.articleTitle);
  formData.append("summary", data.summary);
  formData.append("description", data.description);
  for (let i = 0; i < articlePhoto.length; i++) {
    formData.append("article_photos", articlePhoto[i]);
  }
  fetch(`${url}/${id}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => console.log(err));
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteData(token, id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // window.location.reload();
    })
    .catch((err) => console.log(err));
}
