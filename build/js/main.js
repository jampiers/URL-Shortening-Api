// Burger Menu
const body = document.querySelector("body");
const btnBurger = document.querySelector(".header__btn");
const nav = document.querySelector(".nav-c");

btnBurger.addEventListener("click", () => {
    if(nav.classList.contains("activo")) {
        nav.classList.remove("activo");
        body.classList.remove("no-scroll");
        btnBurger.classList.remove("activo");
    } else {
        nav.classList.add("activo")
        body.classList.add("no-scroll");
        btnBurger.classList.add("activo");
    }
});


// Validate Form
const form = document.querySelector(".form");
const input = document.querySelector(".form__input");
const linksContainer = document.querySelector(".acortador__grid");

let arrayLinks = [];

document.addEventListener("DOMContentLoaded", () => {
    arrayLinks = JSON.parse(localStorage.getItem("links")) || [];
    console.log(arrayLinks);

    showLinks(arrayLinks);
});

form.addEventListener("submit", e => {
    e.preventDefault();
    if(input.value.trim() === "") {
        showError("Please add a link", input);
        return;
    }

    removeError(input);

    getData(input.value);
})

function showError(message, input) {

    removeError();

    input.classList.add("form__input--activo");

    const pError = document.createElement("p");
    pError.classList.add("form__error");
    pError.textContent = message;

    console.log(pError);

    document.querySelector(".form__input-c").appendChild(pError);
}

function removeError(input) {
    if(document.querySelector(".form__error")) {
        document.querySelector(".form__error").remove();
        input.classList.remove("form__input--activo");
    }
}

function getData(link) {
    const url = `https://api.shrtco.de/v2/shorten?url=${link}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if(data.error_code === 2) {
                showError("This is not a valir URL, try again!", input);
                return;
            }

            const { result: {full_short_link, original_link} } = data;

            const linkObject = {original: original_link, linkShortened: full_short_link, id: Date.now() };

            arrayLinks = [...arrayLinks, linkObject];

            showLinks(arrayLinks);
        })
        .catch(error => console.log(error))
}

function showLinks(array) {

    removeHTMLPrevious();

    array.forEach(link => {
        const {original, linkShortened, id} = link;

        const linkDiv = document.createElement("div");
        linkDiv.id = id;
        linkDiv.classList.add("acortador__link");

        const originalLinkP = document.createElement("p");
        originalLinkP.textContent = original;
        originalLinkP.classList.add("acortador__link-original");

        const shortenedLinkDiv = document.createElement("div");
        shortenedLinkDiv.classList.add("acortador__link-acortado-c");

        const shortenedLink = document.createElement("input");
        shortenedLink.value = linkShortened;
        shortenedLink.readOnly = true;
        shortenedLink.classList.add("acortador__link-acortado");

        const btnCopy = document.createElement("button");
        btnCopy.classList.add("acortador__btn-copiar");
        btnCopy.textContent = "Copy";
        btnCopy.onclick = () => {
            copyLink(id, btnCopy);
        }

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("acortador__btn-eliminar");
        btnDelete.onclick = () => {
            deleteLink(id);
        }


        shortenedLinkDiv.appendChild(shortenedLink);
        shortenedLinkDiv.appendChild(btnCopy);
        shortenedLinkDiv.appendChild(btnDelete);

        linkDiv.appendChild(originalLinkP);
        linkDiv.appendChild(shortenedLinkDiv);

        linksContainer.appendChild(linkDiv);

    });

    localStorage.setItem("links", JSON.stringify(arrayLinks));
}

function removeHTMLPrevious() {
    while(linksContainer.firstElementChild) {
        linksContainer.firstElementChild.remove();
    }
}

function copyLink(id, btnCopy) {
    const btnsCopy = linksContainer.querySelectorAll(".acortador__btn-copiar");

    btnsCopy.forEach(btn => {
        btn.classList.remove("acortador__btn-copiar--copiado");
        btn.textContent = "Copy";
    });

    btnCopy.classList.add("acortador__btn-copiar--copiado");
    btnCopy.textContent = "Copied!";

    const texto = document.getElementById(id).querySelector(".acortador__link-acortado");
    texto.select();
    document.execCommand("copy");
}

function deleteLink(id) {
    arrayLinks = arrayLinks.filter(link => link.id !== id);
    showLinks(arrayLinks);
}