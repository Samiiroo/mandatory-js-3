//variables
//_______________________________________________
let nav = document.querySelector('nav'); //listan med main breeds.
let section = document.querySelector('section'); //listan med subreeds.
let main = document.querySelector('main'); //bild och info.
let h1 = document.querySelector('h1'); //titel för breed.
h1.textContent =''; // jag gör den tom för att varje gång så nollställs den efter byte och byts till det andra breed.
let img = document.querySelector('img'); // själva sourcen/bilden.
let button = document.querySelector('button'); // new picture knappen.

let parsedData; // parsed data
let breed; // själva breed från listan
let subBreed;// själva subBreed från listan
let subString; // texten på subbreed som syns i länk;


function big(string) { // Första bokstav Stort
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//=================== toLowerCase ============================================//
function small(string) { // Första bokstav Litet
    return string.charAt(0).toLowerCase() + string.slice(1);
}

//_______________________________________________
//request data/ajax anrop
//här hämtar vi alla breed namnen via ajax anrop sen parsar.
//lägger till ett hash innan substring som är main breed, det visar vilken 'breed sida' vi är på
//_______________________________________________
function getData(){
  let currentBreed = window.location.hash.substring(1);
  let req = new XMLHttpRequest();
  req.open('GET', 'https://dog.ceo/api/breeds/list/all'); //hämta datan från länken
  req.addEventListener('load', parse);//parsa datan vi fått.
  req.send();
}
getData(); //callar på functionen.
//_______________________________________________
// parsar datan från json och sparar den i parsedData och så gör vi en status kontroll och visar det i console.
// Vi kallar på functionen renderText med argument parsedData
function parse(){
  if (this.status >=200 && this.status <300){
    let parsedData=JSON.parse(this.responseText);
    renderText(parsedData.message);
    } else {
        console.error('invalid status'+this.status);
      }
    }
//_______________________________________________
//rendering till lista.

//vi gör en ny ul element, lägger in den i nav elementet, loopar genom objectet data, gör en ny li elemen för varje value i objectet.
//varje gång vi trycker på en li elemnt i listan  så ska den den visa en random bild med samma namn på det vi tryckte på.
function renderText(data){
  let ul = document.createElement('ul');
  nav.appendChild(ul);
  for (let key in data){
    let li = document.createElement('li');
    li.textContent=big(key);
    li.addEventListener('click',function(e){
      window.location.hash = small(e.target.textContent);
      getBreedImg();
      getSubBreed();
    });
    ul.appendChild(li);
  }
}

//_______________________________________________
// ajax anropar subbreed data
//
// function getSubBreed(){
//   let currentBreed = window.location.hash.substring(1); // currentBreed = breed vald inehåll
//   let req = new XMLHttpRequest();
//  req.open('GET', 'https://dog.ceo/api/breed/' + currentBreed + '/list');//hämtar data från länken och väljer breedtryck to visar subbreed till.
//   req.addEventListener('load', parseSubBreed); //när den har hämtat färdigt så ska funcionen parseSubBreed starta
//   req.send(); // skicka ett anrop.
// }
function getSubBreed() {
  let currentBreed = window.location.hash.substring(1);  // currentBreed = breed vald inehåll
  let req = new XMLHttpRequest (); //
  req.open('GET', 'https://dog.ceo/api/breed/' + currentBreed + '/list');//hämtar data från länken och väljer breedtryck to visar subbreed till.
  req.addEventListener("load", parseSubBreed); //när den har hämtat färdigt så ska funcionen parseSubBreed starta
  req.send(); // skicka ett anrop.
}

//_______________________________________________
// en function som parsar objecten, sparar dem i parsedSub och
// sen callar på functionen renderSubText med dens value som argument.
function parseSubBreed() {
  let parsedSub = JSON.parse(this.responseText);
  renderSubText(parsedSub.message);
}
//_______________________________________________
// här renderar vi subBreed datan till listan. genom att lägga in datan som argument
// om breed har en subbreed så kommer den visa och göra en ul för dem subbreed och
// lägga in dem i section.
function renderSubText(data) {
  if (data.length > 0) {
    section.innerHTML = "";
    let currentBreed = window.location.hash.substring(1); // den ska va tom som default för att b den breed vi valt.
    let ul = document.createElement("ul"); //  skapar en ul element som värde till let ul
    section.appendChild(ul); // lägger in ul elementet i section elementet.
    for (let key of data){ // loopar genom objectet data
      let li = document.createElement("li"); // create a new <li>
      li.textContent = big(key); // li string innehål Börjar med stor bokstav
      ul.appendChild(li);
      li.addEventListener("click", function (e) {
        window.location.hash = currentBreed + "/" + small(e.target.textContent);
        getBreedImg();
      });
    }
  } else {
    section.innerHTML = "";
  }
}
//ajax anropar  slump bilder
//
function getRandomImg(){
  let currentBreed = window.location.hash.substring(1);// breed valt till .textContent
  let req = new XMLHttpRequest();
  req.open('GET', 'https://dog.ceo/api/breeds/image/random'); //hämtar random bild från denna url
  req.addEventListener('load', parseImg); // när sidan är laddad så kör igång functionen parseImg
  req.send(); /// Anropar
}
//_______________________________________________
//här skapar vi en function som parsar slump bilderna.
function parseImg(){
  let parsedData= JSON.parse(this.responseText); //sprar parsad data till parsedData
  renderImg(parsedData.message);// callar på functionen renderImg med argumentet och sin value
}

//nu gör vi functionen  som kommer att rendera slumpässiga bilder på vilken breed som helst.
function renderImg(imgData){
  let checkImg =document.querySelector('img'); //slumpmässig bild
  if (checkImg){
    main.removeChild(checkImg); //kommer att rendera bort den tillfälliga aktiva bilden
  }
  let img = document.createElement('img'); // skapar en ny img element
  img.setAttribute('src', imgData); // källan till bilden sätts in i den element.
  main.appendChild(img); // lägger in img bilden från källan, i main elementet
}
//_______________________________________________
//funciionen för den klickbara knappen som renderar en slumpmässig bilden
button.addEventListener('click',function(){
  if(window.location.hash !== '') { // om det finns breed vald så visa slumpmässig bild på vald breeds
    getBreedImg();
  }
  else{               // annars visa en slumpässiga bilder på  olika breeds
    getRandomImg();
  }
});
//_______________________________________________
// functoin som ajaxanropar img breeds från länken  och den valda breedens bild syns.

function getBreedImg(){
  let currentBreed = window.location.hash.substring(1);
  let req = new XMLHttpRequest();
  req.open('GET', 'https://dog.ceo/api/breed/'+currentBreed+'/images/random');
  req.addEventListener('load', parseBreedImg); //när sidan laddas ska bilderna parsas via nästa function parseBreedImg().
  req.send(); //anrop
}
// function som parsar JSON till JS.
//sparar datan till parsedData
// Kallar på functionen renderImg där vi får bilderna och lägger in värdet(breed) som argument.
function parseBreedImg(){
  let parsedData= JSON.parse(this.responseText);
  renderBreedImg(parsedData.message)
}
//function som renderar slumpmässiga bilder.
//finnns det redan en bild så tas den bort
function renderBreedImg(imgData){
  let checkImg= document.querySelector('img');
  if (checkImg){
    main.removeChild(checkImg);
  }
  //Skapar en ny bild element sen lägger jag in bildens src till elementet
  //sen appendar in i main så den syns.
  let img= document.createElement('img');
  img.setAttribute('src',imgData);
  main.appendChild(img);
  setCurrentBreed();
}
// lägger till titel så att länken ändras beroende på vilken breed man valt get stor bokstav. finns det en subbreed så läggs det till. finns det inte så händer synns det inte
function setCurrentBreed() {
  let hash = window.location.hash.substring(1).split('/');
console.log(h1.textContent);
  h1.textContent = '';
  if (hash.length === 2) {
    h1.textContent = big(hash[0]) + ' (' + big(hash[1]) + ')';
  } else {
    h1.textContent = big(hash[0]);
  }
}
// kallar på funcionerna  när hash är tomt så att det inte ser tomt utan en bild.
if (window.location.hash !== '') {
  getBreedImg();
} else {
  getRandomImg();
}
