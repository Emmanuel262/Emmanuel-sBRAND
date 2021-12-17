const logoutBtn = document.querySelector(".user-logout");
const dashboardBtn = document.querySelector(".user-dashboard");
const dashboardData = document.querySelector("section .dashboard--container");
const dashboardSection = document.querySelector("section.dashboard-sec");
const dashboardText = document.querySelectorAll(".dashboardText");
const dashboardCards = document.querySelector("#dashboard-cards");
const createNewArticleBtn = document.querySelector(".dashboard--create-btn");
const updateNewArticleBtn = document.querySelector(".dashboard--update-btn");
const updateAndCreateContainer = document.querySelector(
  ".dashboard-new-design"
);
const backDashboardBtn = document.querySelector(".back-btn-dash");

auth.onAuthStateChanged((user) => {
  if (user) {
    logoutBtn.classList.add("active");
    dashboardData.classList.add("active");

    db.collection("articles")
      .get()
      .then((snapshot) => {
        console.log("successful");
        const data = snapshot.docs;
        console.log("great");
        data.forEach((d) => {
          const card = `
        <div class="card">
              <img
                src="./dist/img/image-1.jpg"
                alt="Card image"
                class="card--img"
              />
              <p class="primary--text dashboardText">
                ${d.data().summary}
              </p>
              <div class="btn-types">
                <a href="./articles.html" class="btn btn__read">Read</a>
                <a href="./dashboard-edit-article.html" class="btn btn__edit"
                  >Edit</a
                >
                <button class="btn btn__delete">Delete</button>
              </div>
              <div class="card__confirm-delete">
                <h6 class="secondary--text">Are you sure about deleting????</h6>
                <div>
                  <button data-id="${
                    d.id
                  }" class="btn__delete btn">Delete</button>
                  <button class="btn btn__create">Cancel</button>
                </div>
              </div>
            </div>
        `;
          // cardsArr.innerHTML += card;

          dashboardCards.innerHTML += card;
          const card_t = dashboardCards.querySelectorAll(".card");
          cardListFunc(card_t);
        });
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });
  } else {
    console.log("no user logged in");
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

// db.collection("articles")
//   .add({
//     articleTitle: "Blondie is the best I know. we the best music again",
//     description: "Blondie is the best I know. description",
//     summary: "Blondie is the best I know. summary",
//   })
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

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
    deleteConfirmBtn.addEventListener("click", (e) => {
      let id = e.target.getAttribute("data-id");
      db.collection("articles")
        .doc(id)
        .delete()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
      card.classList.add("remove");
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
