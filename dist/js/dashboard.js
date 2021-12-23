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
// End of file references

auth.onAuthStateChanged((user) => {
  if (user) {
    logoutBtn.classList.add("active");
    dashboardData.classList.add("active");
    db.collection("articles")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs;
        data.forEach((d) => {
          const card = `
            <div class="card">
              <img
                src="${d.data().imgLink}"
                alt="Card image"
                class="card--img"
              />
              <p class="primary--text dashboardText">
                ${d.data().summary}
              </p>
              <div class="btn-types">
                <a href="./articles.html" class="btn btn__read">Read</a>
                <button class="btn btn__edit edit-article" data-id="${
                  d.id
                }" data-name="${d.data().articleImgName}" 
                  >Edit</button
                >
                <button class="btn btn__delete">Delete</button>
              </div>
              <div class="card__confirm-delete">
                <h6 class="secondary--text">Are you sure about deleting????</h6>
                <div>
                  <button data-id="${d.id}" data-name="${
            d.data().articleImgName
          }"  class="btn__delete btn">Delete</button>
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
      .catch((error) => {
        console.log(error);
      });
  } else {
    logoutBtn.classList.remove("active");
    dashboardBtn.classList.remove("active");
    dashboardData.classList.remove("active");
    dashboardSection.innerHTML = `<p class="primary--text notify-message">Please click to home and login to access data or <a href="./index.html">click here</a></p>`;
  }
});

// DASHBOARD ACCESS
dashboardBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./dashboard.html";
});

// LOGOUT
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  auth.signOut().then(() => {
    window.location.reload();
    console.log("user signed out");
  });
});

function cardListFunc(cardList) {
  cardList.forEach((card) => {
    const deleteBtn = card.querySelector(".btn__delete");
    const cardConfirm = card.querySelector(".card__confirm-delete");
    deleteBtn.addEventListener("click", () => {
      cardConfirm.classList.add("active");
    });
    const cancelBtn = cardConfirm.querySelector(".btn__create");
    cancelBtn.addEventListener("click", () => {
      cardConfirm.classList.remove("active");
    });
    const deleteConfirmBtn = cardConfirm.querySelector(".btn__delete");
    const editBtn = card.querySelector(".edit-article");
    deleteConfirmBtn.addEventListener("click", (e) => {
      let id = e.target.getAttribute("data-id");
      let imgName = e.target.getAttribute("data-name").split(".")[0];
      deleteFile(imgName);
      db.collection("articles")
        .doc(id)
        .delete()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
      card.classList.add("remove");
    });

    editBtn.addEventListener("click", (e) => {
      updateAndCreateContainer.classList.add("active");
      let id = e.target.getAttribute("data-id");
      let articleName = e.target.getAttribute("data-name").split(".")[0];
      // console.log(articleName);
      // let imgeNameToTest = getFileName(files[0]);
      // let deleteConfirm = false;
      // if (imgeNameToTest !== articleName) {
      //   deleteConfirm = true;
      // } else {
      //   deleteConfirm = false;
      // }
      // deleteFile(imgName);
      articleForm.classList.add("updating");
      const updateBtn = articleForm["dashboard--update-btn"];
      updateBtn.innerHTML = "Update Article";
      glabFormData(id);
      submitFormFunc(true, id, articleName);
    });
  });
}

// Create new article btn
createNewArticleBtn.addEventListener("click", () => {
  updateAndCreateContainer.classList.add("active");
});
backDashboardBtn.addEventListener("click", () => {
  updateAndCreateContainer.classList.remove("active");
});

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

function glabFormData(id) {
  if (id) {
    let title = "";
    let descriptions = "";
    const articleTitle = articleForm["article__title"];
    db.collection("articles")
      .doc(id)
      .get()
      .then((snapshot) => {
        let data = snapshot.data();
        articleTitle.value = data.articleTitle;
        tinyMCE
          .get("article__description")
          .setContent(`<p>${data.summary}</p> <div>${data.description}</div>`);

        title = articleTitle.value;
        descriptions = tinyMCE.get("article__description").getContent();
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

async function submitFormFunc(editCreate = false, id, nameTest = "") {
  articleForm.addEventListener("submit", async (e) => {
    if (editCreate === true && id !== undefined) {
      e.preventDefault();
      const articleTitle = glabFormData(id).articleTitle;
      const summary = dataManipulation(glabFormData(id).description).summary;
      const description = dataManipulation(
        glabFormData(id).description
      ).description;
      if (id) {
        uploadProcess(() => {
          db.collection("articles")
            .doc(id)
            .update({
              articleTitle,
              summary,
              description,
              imgLink: imgURL,
              articleImgName: imgImgName,
            })
            .then((result) => {
              if (
                nameTest !== imgImgName ||
                nameTest === undefined ||
                nameTest === "undefined"
              ) {
                deleteFile(nameTest);
              } else {
                console.log("not deleting");
                return result;
              }
            })
            .then((result) => {
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
          articleForm.reset();
          dashboardCreateContainer.classList.remove("active");
        });
      }
    } else {
      e.preventDefault();

      const articleTitle = glabFormData().articleTitle;
      const summary = dataManipulation(glabFormData().description).summary;
      const description = dataManipulation(
        glabFormData().description
      ).description;
      uploadProcess(() => {
        db.collection("articles")
          .add({
            articleTitle,
            summary,
            description,
            imgLink: imgURL,
            articleImgName: imgImgName,
          })
          .then((result) => {
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });

        articleForm.reset();
        dashboardCreateContainer.classList.remove("active");
      });
    }
    // console.log(getFileToUpload());
  });
}

// submitFormFunc(false);
createNewArticleBtn.addEventListener("click", () => {
  submitFormFunc(false, (nameTest = ""));
});

// inputFile for image functionality

// get file name from input
function getFileExt(file) {
  var temp = file.name.split(".");
  var ext = temp.slice(temp.length - 1, temp.length);
  return "." + ext[0];
}

// get file extention from input
function getFileName(file) {
  var temp = file.name.split(".");
  var fname = temp.slice(0, -1).join(".");
  return fname;
}

// upload btn testing
const uploadBtnTest = document.querySelector(".upload-test");
uploadBtnTest.addEventListener("click", () => {
  uploadProcess();
});

input.onchange = (e) => {
  files = e.target.files;
  previewText.style.display = "none";
  previewImage.style.display = "block";

  reader.addEventListener("load", function () {
    previewImage.setAttribute("src", this.result);
  });

  reader.readAsDataURL(files[0]);
};
reader.onload = function () {
  imagePreview.src = reader.result;
};

// async function to upload image
async function uploadProcess(funcSubmit) {
  var imgToUpload = files[0];
  var imgName = getFileName(files[0]);
  var imgExtention = getFileExt(files[0]);
  const metaData = {
    contentTpe: imgToUpload.type,
  };
  const uploadTask = firebase
    .storage()
    .ref("Images/" + imgName)
    .put(files[0]);
  // console.log(uploadTask);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (err) => {
      console.log(err);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((url) => {
        imgURL = url;
        imgImgName = imgName + imgExtention;
        funcSubmit();
      });
    }
  );
}

function setImgUrl(imgurl) {
  const newUrl = imgurl;
  imgURL = newUrl;
}

const selectImageBtn = document.querySelector(".inptFile");
reader.onload = function () {
  imagePreview.src = reader.result;
};

//   SELECT
selectImageBtn.onclick = function () {
  input.click();
};

// deleting image

async function deleteFile(name) {
  const storageRef = firebase.storage().ref();
  // [START storage_delete_file]
  // Create a reference to the file to delete
  var desertRef = storageRef.child(`Images/${name}`);
  console.log(desertRef);
  // Delete the file
  await desertRef
    .delete()
    .then(() => {
      // File deleted successfully
      console.log("successful");
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log(error);
    });
  // [END storage_delete_file]
}
