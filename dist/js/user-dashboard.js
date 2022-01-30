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

const spinnerCont = document.querySelector(".loader-container");
function showSpinner() {
  spinnerCont.classList.remove("loader-hide");
}
function hideSpinner() {
  spinnerCont.classList.add("loader-hide");
}

var input = document.createElement("input");
var reader = new FileReader();
input.type = "file";
let files = [];
let article_to_read_id = [];
// End of file references

const dashboardTypes = document.querySelector(".dashboard-type");
const loginBtnN = document.querySelector(".btn__login");
const fileInput = document.getElementById("inptFile");

// fileInput.onchange = function (e) {
//   console.log(e.files);
// };

let articlePhoto;
fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  articlePhoto = files;
});

const cookie = Cookies.get("jwt");
if (cookie) {
  logoutBtn.classList.add("active");
  dashboardData.classList.add("active");
  dashboardTypes.classList.add("active");
  loginBtnN.classList.add("active");
  createNewArticleBtn.style.display = "block";
} else {
  createNewArticleBtn.style.display = "none";
  loginBtnN.classList.remove("active");
  logoutBtn.classList.remove("active");
  dashboardBtn.classList.remove("active");
  dashboardData.classList.remove("active");
  dashboardTypes.classList.remove("active");
}

logoutBtn.addEventListener("click", () => {
  Logout();
});

// Create new article btn
createNewArticleBtn.addEventListener("click", () => {
  updateAndCreateContainer.classList.add("active");
});

backDashboardBtn.addEventListener("click", () => {
  updateAndCreateContainer.classList.remove("active");
});

function setFormData(id) {
  const articleTitle = createAndEditForm["article__title"];
  showSpinner();
  fetch(`${url}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const da = data.data.data;
      articleTitle.value = da.articleTitle;
      tinyMCE
        .get("article__description")
        .setContent(`<p>${da.summary}</p> <div>${da.description}</div>`);
      hideSpinner();
    })
    .catch((err) => {
      console.log(err);
    });
}

function glabFormData() {
  const articleTitles = createAndEditForm["article__title"].value;
  const descriptions = tinyMCE.get("article__description").getContent();
  summary = descriptions
    .split("</div>")[0]
    .replace("<div>", "")
    .replace("<div>", "");

  return {
    articleTitle: articleTitles,
    description: descriptions,
    summary: summary,
  };
}

function descriptionRetrieve(description, container, des = "p") {
  if (des === "p") {
    desc = description.split("</p>").slice(1, description.length);
    desc.forEach((des) => {
      container += des.replace("&nbsp;", "");
    });
    summary = removeTags(description.split("</p>")[0]);
  } else if (des === "div") {
    desc = description.split("</div>").slice(1, description.length);
    summary = description
      .split("</div>")[0]
      .replace("<div>", "")
      .replace("<div>", "");
    desc.forEach((cont) => {
      container += cont.replace("<div>", "").replace("&nbsp;", "");
    });
  } else {
    return;
  }

  return {
    summary,
    container,
  };
}

function dataManipulation(description) {
  let desc = "";
  let artDesc = "";
  let summary = "";
  if (
    // (description.includes("<div>") || description.includes("</div>")) &&
    description.includes("<p>") ||
    description.includes("</p>")
  ) {
    summary = descriptionRetrieve(description, artDesc, "p").summary;
    desc = descriptionRetrieve(description, artDesc, "p").container;
    descriptionRetrieve(description, artDesc, "p");
  } else if (description.includes("<div>") || description.includes("</div>")) {
    summary = descriptionRetrieve(description, artDesc, "div").summary;
    desc = descriptionRetrieve(description, artDesc, "div").container;
  } else {
    summary = descriptionRetrieve(description, artDesc, "p").summary;
    desc = descriptionRetrieve(description, artDesc, "p").container;
  }

  return {
    summary,
    description: removeTags(desc),
  };
}

function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
}

function dataToUpload() {
  return {
    articleTitle: glabFormData().articleTitle,
    summary: dataManipulation(glabFormData().description).summary,
    description: dataManipulation(
      glabFormData().description
    ).description.replace(/\n/g, ""),
  };
}

createAndEditForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = Cookies.get("jwt");
  createData(token, glabFormData());
  createAndEditForm.reset();
});

function createData(token, data) {
  const formData = new FormData();
  formData.append("articleTitle", data.articleTitle);
  formData.append("summary", data.summary);
  formData.append("description", data.description);
  for (let i = 0; i < articlePhoto.length; i++) {
    formData.append("article_photos", articlePhoto[i]);
  }
  showSpinner();
  fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      hideSpinner();
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

function Logout() {
  showSpinner();
  fetch(`${urld}/logout`)
    .then((res) => res.json())
    .then((data) => {
      Cookies.set("jwt", "");
      console.log(data);
      hideSpinner();
      window.location.reload();
    })
    .catch((err) => console.log(err));
}

// From views file
bringDataInFromAPI();
function bringDataInFromAPI() {
  showSpinner();
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
        hideSpinner();
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

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

    let idTo;
    editBtn.addEventListener("click", (e) => {
      updateAndCreateContainer.classList.add("active");
      let id = e.target.getAttribute("data-id");
      idTo = id;
      let articleName = e.target.getAttribute("data-name").split(".")[0];
      articleForm.classList.add("updating");
      const updateBtn = articleForm["dashboard--update-btn"];
      updateBtn.innerHTML = "Update Article";
      setFormData(id);
      // submitFormFunc(true, id);
      const token = Cookies.get("jwt");
      submitFormFuncss(true, id, token);
    });
  });
}

// TESTING FUNCTION
function glabFormDatass(id) {
  if (id) {
    let title = "";
    let descriptions = "";
    const articleTitle = articleForm["article__title"];
    showSpinner();
    fetch(`${url}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const da = data.data.data;
        articleTitle.value = da.articleTitle;
        tinyMCE
          .get("article__description")
          .setContent(`<p>${da.summary}</p> <div>${da.description}</div>`);
        hideSpinner();
      })
      .catch((err) => {
        console.log(err);
      });
    return {
      articleTitle: articleTitle.value,
      description: tinyMCE.get("article__description").getContent(),
    };
  } else {
    const articleTitleS = articleForm["article__title"].value;
    const descriptionS = tinyMCE.get("article__description").getContent();

    return {
      articleTitle: articleTitleS,
      description: descriptionS,
    };
  }
}

async function submitFormFuncss(editCreate = false, id, token) {
  articleForm.addEventListener("submit", async (e) => {
    if (editCreate === true && id !== undefined) {
      e.preventDefault();
      const articleTitle = glabFormDatass(id).articleTitle;
      const summary = dataManipulation(glabFormDatass(id).description).summary;
      const description = dataManipulation(
        glabFormDatass(id).description
      ).description;
      if (id) {
        const formData = new FormData();
        formData.append("articleTitle", articleTitle);
        formData.append("summary", summary);
        formData.append("description", description);
        if (articlePhoto) {
          for (let i = 0; i < articlePhoto.length; i++) {
            formData.append("article_photos", articlePhoto[i]);
          }
        }
        showSpinner();
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
            // window.location.reload();
            hideSpinner();
            console.log(data);
          })
          .catch((err) => console.log(err));
        // articleForm.reset();
        // dashboardCreateContainer.classList.remove("active");
      }
    }
  });
}

// END OF TESTING FUNCTION

function submitData(form) {
  form.addEventListener("submit", (e) => {
    const articleTitle = glabFormData().articleTitle;
    const summary = dataManipulation(glabFormData().description).summary;
    const description = dataManipulation(
      glabFormData().description
    ).description;
  });
}

function updateData(token, data, id) {
  const formData = new FormData();
  formData.append("articleTitle", data.articleTitle);
  formData.append("summary", data.summary);
  formData.append("description", data.description);
  if (articlePhoto) {
    for (let i = 0; i < articlePhoto.length; i++) {
      formData.append("article_photos", articlePhoto[i]);
    }
  }
  showSpinner();
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
      hideSpinner();
      window.location.reload();
      console.log(data);
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
