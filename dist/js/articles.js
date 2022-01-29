const queryString = window.location.search.replace("?", "");
const url = "https://emmanuel-brand.herokuapp.com/api/v1/articles";
const urlc = "https://emmanuel-brand.herokuapp.com/api/v1/comments";
const articleContainerContent = document.querySelector(
  ".article__container--article-content"
);
const articleComments = document.querySelector(".article__comments--comments");
const articleCommentForm = document.getElementById("comment-on-article");
// window.addEventListener("load", (e) => {
//   console.log("page is full loaded");
//   bringData(`${url}/${queryString}`);
// });
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

function bringData(inputUrl) {
  fetch(inputUrl)
    .then((res) => res.json())
    .then((data) => {
      const da = data.data.data;
      const dat = insertData(da);
      articleContainerContent.innerHTML = dat;
      da.comments.forEach((comment) => {
        articleComments.innerHTML += insertComent(comment);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function insertData(dat) {
  const data = `
        <h5 class="primary--header">${dat.articleTitle}</h5>
        <p class="secondary--text">
        ${dat.summary}
        </p>
        <div class="article__container--images">
            <div class="img-one">
            <img
                src="./dist/img/image-1.jpg"
                alt="Article image 1"
                class="article-img"
            />
            <small>image-1 description</small>
            </div>
            <div class="img-one">
            <img
                src="./dist/img/image-1.jpg"
                alt="Article image 1"
                class="article-img"
            />
            <small>image-1 description</small>
            </div>
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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
