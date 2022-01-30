const urlq = "https://emmanuel-brand.herokuapp.com/api/v1/queries";
const urld = "https://emmanuel-brand.herokuapp.com/api/v1/dashboard";
const queryForm = document.getElementById("query-contact-form");
const loginForm = document.querySelector(".login-form");
const loginBtnN = document.querySelector(".btn__login");
const logoutBtn = document.querySelector(".user-logout");
const dashboardBtn = document.querySelector(".user-dashboard");
const spinnerCont = document.querySelector(".loader-container");

const cookie = Cookies.get("jwt");
if (cookie) {
  logoutBtn.classList.add("active");
  dashboardBtn.classList.add("active");
  loginBtnN.classList.add("active");
}

logoutBtn.addEventListener("click", () => {
  Logout();
});

queryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  sendQuery(getMessageFormData(queryForm));
  ClearFormData(queryForm);
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginFun(getLoginFormData(loginForm));
  ClearLoginData(loginForm);
});

function getMessageFormData(form) {
  return {
    name: form["name"].value,
    email: form["email"].value,
    message: form["message"].value,
  };
}
function getLoginFormData(form) {
  return {
    email: form["email"].value,
    password: form["password"].value,
  };
}
function ClearFormData(form) {
  form["name"].value = "";
  form["email"].value = "";
  form["message"].value = "";
}
function ClearLoginData(form) {
  form["email"].value = "";
  form["password"].value = "";
}

function sendQuery(datas) {
  const data = {
    name: datas.name,
    email: datas.email,
    message: datas.message,
  };
  fetch(urlq, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      setTimeout((window.location = "./thank_you.html"), 1000);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function showSpinner() {
  spinnerCont.classList.remove("loader-hide");
}
function hideSpinner() {
  spinnerCont.classList.add("loader-hide");
}

function loginFun(data) {
  showSpinner();
  fetch(`${urld}/login`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      console.log(data.token);
      Cookies.set("jwt", data.token.token, { expires: 1 });
      logoutBtn.classList.add("active");
      loginBtnN.classList.add("active");
      dashboardBtn.classList.add("active");
      hideSpinner();
      window.location.reload();
    })
    .catch((err) => console.log(err));
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
