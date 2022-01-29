// Create new article btn
createNewArticleBtn.addEventListener("click", () => {
  updateAndCreateContainer.classList.add("active");
});

function glabFormData(id) {
  if (id) {
    let title = "";
    let descriptions = "";
    let summary = "";
    const articleTitle = createAndEditForm["article__title"];
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
        summary = descriptions
          .split("</div>")[0]
          .replace("<div>", "")
          .replace("<div>", "");
      });
    return {
      articleTitle: articleTitle.value,
      description: tinyMCE.get("article__description").getContent(),
      summary: summary,
    };
  } else {
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
  var token = getCookie("jwt");
  createData(token, dataToUpload());
  createAndEditForm.reset();
});

function createData(token, data) {
  const formData = new FormData();
  formData.append("articleTitle", data.articleTitle);
  formData.append("summary", data.summary);
  formData.append("description", data.description);
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
      console.log(data);
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
