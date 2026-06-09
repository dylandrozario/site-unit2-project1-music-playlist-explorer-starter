const btn = document.querySelector(".modal-close");
const modalOverlay = document.querySelector("#modalOverlay");

btn.addEventListener("click", () => {
    console.log("Button clicked");
    modalOverlay.style.display = "none";
});