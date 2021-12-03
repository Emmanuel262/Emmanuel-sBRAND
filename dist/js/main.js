const toggleBtn = document.getElementById('btn-deactive');
const navContainer = document.querySelector('.header__nav--container');


const addActive = (container, img) => {
    container.classList.add('active');
    img.src = "./dist/img/close.svg";
}
const removeActive = (container, img) => {
    container.classList.remove('active');
    img.src = "./dist/img/bars.svg";
}

toggleBtn.addEventListener('click', () => {
    // navContainer.classList.toggle('active');
    const img = toggleBtn.querySelector('img');
    if (navContainer.classList.contains('active')) {
        removeActive(navContainer, img);
    } else {
        addActive(navContainer, img);
    }
});
