const loginForm = document.querySelector(".login-form");
const loginBtnN = document.querySelector(".btn__login");
const logoutBtn = document.querySelector(".user-logout");
const dashboardBtn = document.querySelector(".user-dashboard");

// db.collection("articles")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       console.log(doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
logoutBtn.addEventListener("click", (e) => {
  console.log("btn clicked");
  e.preventDefault();

  auth.signOut().then(() => {
    window.location.reload();
    console.log("user signed out");
  });
});

// DASHBOARD ACCESS
dashboardBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./dashboard.html";
});

auth.onAuthStateChanged((user) => {
  if (user) {
    logoutBtn.classList.add("active");
    loginBtnN.classList.add("active");
    dashboardBtn.classList.add("active");
    // db.collection("experience")
    //   .get()
    //   .then((snapshot) => {
    //     console.log("successful");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     console.log("error");
    //   });
  } else {
    console.log("no user logged in");
    logoutBtn.classList.remove("active");
    loginBtnN.classList.remove("active");
    dashboardBtn.classList.remove("active");
  }
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.querySelector("#email").value;
  const password = loginForm.querySelector("#password").value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      console.log(cred.user);
      console.log("loged in user");
      window.location.reload();

      loginForm.reset();
      loginForm.parentElement.parentElement.classList.remove("active");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Bring data

db.collection("articles")
  .get()
  .then((snapshot) => {
    console.log("successful");
    const data = snapshot.docs;
    data.forEach((dat) => {
      console.log(dat.data());
    });
  })
  .catch((error) => {
    console.log(error);
    console.log("error");
  });
