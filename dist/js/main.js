const toggleBtn = document.getElementById('btn-deactive');
const navContainer = document.querySelector('.header__nav--container');
const cardList = document.querySelectorAll('#dashboard-card');
const infoReadMoreBtn = document.getElementById('info-readmore');
const modalContainer = document.querySelector('.about--modal');

console.log(cardList);


const addActive = (container, img= '') => {
    container.classList.add('active');
    img.src = "./dist/img/close.svg";
}
const removeActive = (container, img= '') => {
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

cardList.forEach(card => {
    const deleteBtn = card.querySelector('.btn__delete');
    const cardConfirm = card.querySelector('.card__confirm-delete');
    deleteBtn.addEventListener('click', () => {
        console.log(card);
        cardConfirm.classList.add('active');
    });
    const cancelBtn = cardConfirm.querySelector('.btn__create');
    cancelBtn.addEventListener('click', () => {
        cardConfirm.classList.remove('active');
    })
    const deleteConfirmBtn = cardConfirm.querySelector('.btn__delete');
    deleteConfirmBtn.addEventListener('click', () => {
        card.classList.add('remove');
    })
})

// // const inpFile = document.getElementById('inptFile');
// const inpFile = document.querySelector('.inptFile');
// const previewContainer = document.getElementById('imagePreview');
// const previewImage = document.querySelector('.image-preview__image');
// const previewText = document.querySelector('.image-preview__default-text');

// inpFile.addEventListener('change', function(){
//     const file = this.files[0];
    
//     if (file) {
//         const reader = new FileReader();

//         previewText.style.display = "none";
//         previewImage.style.display = "block";

//         reader.addEventListener('load', function() {
//             console.log(this);
//             previewImage.setAttribute("src", this.result);
//         });

//         reader.readAsDataURL(file);
//     } else {
//         // console.log('junior');
//         previewText.style.display = null;
//         previewImage.style.display = null;

//         previewImage.setAttribute("src", "");
//     }
// })

infoReadMoreBtn.addEventListener('click', () => {
    modalContainer.classList.add('active');

})
const closeBtn = document.getElementById('btn-deactive--modal')
closeBtn.addEventListener('click', () => {
    modalContainer.classList.remove('active');
})
