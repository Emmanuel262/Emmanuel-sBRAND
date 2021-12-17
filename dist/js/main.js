const toggleBtn = document.getElementById("btn-deactive");
const navContainer = document.querySelector(".header__nav--container");
const cardList = document.querySelectorAll("#dashboard-card");
const infoReadMoreBtn = document.getElementById("info-readmore");
const modalContainer = document.querySelector(".about--modal");
const experienceBtn = document.querySelectorAll(".exp-btn");
const experienceModal = document.querySelector(".experience__modal-container");
const closeBtn = document.getElementById("btn-deactive--modal");
const closeBtnModals = document.querySelectorAll(".btn--modal");
const experienceBtns = document.querySelectorAll(".experience-sec__list--item");
const experienceContainers = document.querySelectorAll(".experience-container");
const projectBtns = document.querySelectorAll(".project__btn");
const projectLists = document.querySelectorAll(".projects-descriptions");
const projectCloseBtn = document.querySelectorAll(".btn-deactive--project");
const loginBtn = document.querySelector(".btn__login");
const loginSec = document.querySelector(".login-sec");
const loginCloseBtn = document.querySelector(".login-close--btn");
const backTopBtn = document.querySelector(".back-top-top");

const addActive = (container, img = "") => {
  container.classList.add("active");
  img.src = "./dist/img/close.svg";
};
const removeActive = (container, img = "") => {
  container.classList.remove("active");
  img.src = "./dist/img/bars.svg";
};

toggleBtn.addEventListener("click", () => {
  const img = toggleBtn.querySelector("img");
  if (navContainer.classList.contains("active")) {
    removeActive(navContainer, img);
  } else {
    addActive(navContainer, img);
  }
});

infoReadMoreBtn.addEventListener("click", () => {
  modalContainer.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  if (modalContainer.classList.contains("active")) {
    modalContainer.classList.remove("active");
  }
});

closeBtnModals.forEach((closeBtnM) => {
  closeBtnM.addEventListener("click", () => {
    if (closeBtnM.parentElement.classList.contains("active")) {
      closeBtnM.parentElement.classList.remove("active");
    }
  });
});

experienceBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.lastElementChild.classList.add("active");
  });
});

const checkActive = (input) => {
  input.forEach((btn) => {
    if (btn.classList.contains("active")) {
      btn.classList.remove("active");
    }
  });
};

const experienceActive = (experienceSelector) => {
  experienceContainers.forEach((experience) => {
    if (experienceSelector === "rba") {
      if (experience.id === "rba-experience") {
        checkActive(experienceContainers);
        experience.classList.add("active");
      }
    } else if (experienceSelector === "school") {
      if (experience.id === "school-experience") {
        checkActive(experienceContainers);
        experience.classList.add("active");
      }
    } else if (experienceSelector == "andela") {
      if (experience.id === "andela-experience") {
        checkActive(experienceContainers);
        experience.classList.add("active");
      }
    }
  });
};

experienceBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "experience-1") {
      checkActive(experienceBtns);
      btn.classList.add("active");
      experienceActive("rba");
    } else if (btn.id === "experience-2") {
      checkActive(experienceBtns);
      btn.classList.add("active");
      experienceActive("school");
    } else {
      checkActive(experienceBtns);
      btn.classList.add("active");
      experienceActive("andela");
    }
  });
});

projectBtns.forEach((projectBtn) => {
  projectBtn.addEventListener("click", () => {
    projectLists.forEach((project) => {
      if (
        projectBtn.parentElement.classList.contains("project-1") &&
        project.classList.contains("project-1")
      ) {
        project.classList.add("active");
      } else if (
        projectBtn.parentElement.classList.contains("project-2") &&
        project.classList.contains("project-2")
      ) {
        project.classList.toggle("active");
      } else if (
        projectBtn.parentElement.classList.contains("project-3") &&
        project.classList.contains("project-1")
      ) {
        project.classList.toggle("active");
      }
    });
  });
});

projectCloseBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.remove("active");
  });
});

loginBtn.addEventListener("click", () => {
  loginSec.classList.add("active");
});
loginCloseBtn.addEventListener("click", () => {
  loginSec.classList.remove("active");
});

// back to top functionality
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    backTopBtn.classList.add("active");
  } else {
    backTopBtn.classList.remove("active");
  }
});
