const queryString = window.location.search.replace("?", "");
const url = "https://emmanuel-brand.herokuapp.com/api/v1/articles";
const urlc = "https://emmanuel-brand.herokuapp.com/api/v1/comments";
const articleContainerContent = document.querySelector(
  ".article__container--article-content"
);
const articleComments = document.querySelector(".article__comments--comments");
const articleCommentForm = document.getElementById("comment-on-article");
const spinnerCont = document.querySelector(".loader-container");

window.onload = (e) => {
  console.log("page is full loaded");
  bringData(`${url}/${queryString}`);
};
articleCommentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendComment(queryString, getCommentFormData(articleCommentForm));
  articleComments.innerHTML += insertComent(
    getCommentFormData(articleCommentForm)
  );
  ClearFormData(articleCommentForm);
});

function showSpinner() {
  spinnerCont.classList.remove("loader-hide");
}
function hideSpinner() {
  spinnerCont.classList.add("loader-hide");
}

function bringData(inputUrl) {
  showSpinner();
  fetch(inputUrl)
    .then((res) => res.json())
    .then((data) => {
      const da = data.data.data;
      const dat = insertData(da);
      articleContainerContent.innerHTML = dat;
      da.comments.forEach((comment) => {
        articleComments.innerHTML += insertComent(comment);
      });
      hideSpinner();
    })
    .catch((err) => {
      console.log(err);
    });
}

function insertData(dat) {
  let pictures = [];
  dat.article_photos.forEach((photo) => {
    pictures.push(`
    <div class="img-one">
    <img
        src="${photo}"
        alt="Article image 1"
        class="article-img"
    />
    <small>${dat.articleTitle}</small>
    </div>
    `);
  });
  const data = `
        <h5 class="primary--header">${dat.articleTitle}</h5>
        <p class="secondary--text">
        ${dat.summary}
        </p>
        <div class="article__container--images">
            ${pictures}
        </div>
        <p class="secondary--text">
        ${dat.description}
        </p>
    
    `;

  return data;
}

function insertComent(comment) {
  const commentDat = `
    <div class="comment">
        <h5 class="secondary--header">${comment.name}</h5>
        <p class="secondary--text">
        ${comment.comment}
        </p>
    </div>
    `;

  return commentDat;
}

function getCommentFormData(form) {
  return {
    name: form["name"].value,
    email: form["email"].value,
    comment: form["message"].value,
  };
}
function ClearFormData(form) {
  form["name"].value = "";
  form["email"].value = "";
  form["message"].value = "";
}

function sendComment(id, datas) {
  const data = {
    name: datas.name,
    email: datas.email,
    comment: datas.comment,
  };
  showSpinner();
  fetch(`${urlc}/${id}`, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      hideSpinner();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
