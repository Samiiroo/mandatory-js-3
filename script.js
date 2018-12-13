let ul = document.querySelector('ul');
let main = document.querySelector('main');
let section = document.querySelector('section ul');
let hash = '';
let hashSub ='';
let hashRemoved = '';

window.addEventListener("hashchange", function() {
    hash = window.location.hash.substring(1);
    main.innerHTML = ' ';
    section.innerHTML = ' ';
    location.reload()
    main.innerHTML = '<h3>' + capitalize(hash) + '</h3>';
    request('GET', 'https://dog.ceo/api/breed/'+ hashRemoved +'/images/random', breedPicture);
    request('GET', "https://dog.ceo/api/breed/" + hashRemoved +"/list", subBreedList);
});

/* ---- capitalize ---- */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* ---- REQUESTS ---- */
function request(method, url, run) {
    let req = new XMLHttpRequest();
    req.addEventListener("load", run);
    req.open(method, url);
    req.send();
    }


/* ---- lista med alla breeds ---- */
function renderAllBreedList() {
    let myArray = JSON.parse(this.responseText);
    let data = myArray.message;
    for (let dog in data) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('href', '#' + dog);
        a.textContent = capitalize(dog);
        a.addEventListener('click', getBreedsRandomPicture);
        ul.appendChild(li);
        li.appendChild(a);
    }
}

/* ---- Random Pictures ---- */
function getRandomPicture() {
    main.innerHTML = ' ';
    main.innerHTML = ' ';
    request('GET', 'https://dog.ceo/api/breeds/image/random', randomPicture)
}

function randomPicture() {
    let pic = JSON.parse(this.responseText);
    let data = pic.message;
    let img = document.createElement('img');
    img.setAttribute('src', data);
    img.setAttribute('id', 'picture');
    main.appendChild(img);
    let button = document.createElement('input')
    button.setAttribute('value', 'Shuffle');
    button.setAttribute('type', 'button');
    button.setAttribute('onClick', 'getRandomPicture()');
    main.appendChild(button);
}

/* ----   hämtar Random breed bild ---- */
function getBreedsRandomPicture() {
    hashRemoved = this.getAttribute('href').substring(1);
    main.innerHTML = ' ';
    section.innerHTML = ' ';
    request('GET', 'https://dog.ceo/api/breed/'+ hashRemoved +'/images/random', breedPicture);
    request('GET', "https://dog.ceo/api/breed/" + hashRemoved +"/list", subBreedList)

}

function breedPicture() {
    let pic = JSON.parse(this.responseText);
    let data = pic.message;
    main.innerHTML = '<h3>' + capitalize(hashRemoved) + '</h3>';
    let img = document.createElement('img');
    img.setAttribute('src', data);
    img.setAttribute('id', 'picture');
    main.appendChild(img);
    let a = document.createElement('a')
    a.setAttribute('href', '#' + hash);
    a.setAttribute('class', 'PicButton');
    a.addEventListener('click', getBreedsRandomPicture);
    a.textContent = 'New Picture';
    main.appendChild(a);

}

/* ---- hämtar Subbreed lista ---- */
function subBreedList() {
    let myArray = JSON.parse(this.responseText);
    let data = myArray.message;
    if (data.length !== 0) {
        section.innerHTML = ' ';
        let h4 = document.createElement('h4');
        h4.textContent = ('Sub-breeds');
        section.appendChild(h4);
    }
    for (let key in data) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('href', '#' +hashRemoved+'/'+ data[key]);
        a.addEventListener('click', subBreedsRandomPic);
        a.textContent = capitalize(data[key]);
        section.appendChild(li);
        li.appendChild(a);
    }
}

/* ---- Hämtar subbreeds random bild ---- */
function subBreedsRandomPic() {
    hashSub = this.getAttribute('href').substring(1);
    main.innerHTML = ' ';
    request('GET', 'https://dog.ceo/api/breed/'+ hashRemoved +'/images/random', subBreedPicture)
    request('GET', "https://dog.ceo/api/breed/" + hashRemoved +"/list", subBreedList)
}

function subBreedPicture() {
    let pic = JSON.parse(this.responseText);
    let data = pic.message;
    main.innerHTML = '<h3>' + capitalize(hashRemoved)  + '</h3>';
    let img = document.createElement('img');
    img.setAttribute('src', data);
    img.setAttribute('id', 'picture');
    main.appendChild(img);
    let a = document.createElement('a')
    a.setAttribute('href', '#' + hashRemoved);
    a.setAttribute('class', 'PicButton');
    a.textContent = 'New Picture';
    a.addEventListener('click', subBreedsRandomPic)
    main.appendChild(a);
    let a2 = document.createElement('a')
    a2.setAttribute('href', '#' + hash);
    a2.setAttribute('class', 'PicButton');
    a2.addEventListener('click', getBreedsRandomPicture);
    a2.textContent = 'Back';
    main.appendChild(a2);
}

function startRender() {
    request('GET', 'https://dog.ceo/api/breeds/list/all', renderAllBreedList);

    if (window.location.hash !== '') {
        hashRemoved = window.location.hash.substring(1);
        request('GET', 'https://dog.ceo/api/breed/'+ hashRemoved +'/images/random', subBreedPicture);
        request('GET', "https://dog.ceo/api/breed/" + hashRemoved +"/list", subBreedList)
    } else {
    getRandomPicture();
    }
}

startRender();
