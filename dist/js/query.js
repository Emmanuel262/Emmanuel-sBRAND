const urlq = "https://emmanuel-brand.herokuapp.com/api/v1/queries";
const urld = "https://emmanuel-brand.herokuapp.com/api/v1/dashboard";
const queryForm = document.getElementById("query-contact-form");
const loginForm = document.querySelector(".login-form");

queryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  sendQuery(getMessageFormData(queryForm));
  ClearFormData(queryForm);
  window.location = "./thank_you.html";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginFun(getLoginFormData(loginForm));
  ClearLoginData(loginForm);
  //   window.location = "./thank_you.html";
  //   myTimeOut();
});

// const myTimeOut = setTimeout(myGreeting, 5000);
// function myGreeting() {
//   console.log("greeting");
// }

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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loginFun(data) {
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
      setTimeout((window.location = "./thank_you.html"), 1000);
      Cookies.set("jwt", data.token.token);
    })
    .catch((err) => console.log(err));
}
