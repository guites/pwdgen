// DOM LIST //

const wordsURL = "https://api.dicionario-aberto.net/random";
const classifyURL = "https://api.dicionario-aberto.net/word/";
const sortButton = document.querySelector('#sort');
const randomResultBox = document.querySelector('.random-result-box');
const substantivoTable = document.querySelector('#substantivos > tbody');
const adjetivoTable = document.querySelector('#adjetivos > tbody');
const resultToCopy = document.querySelector('#result > div > input');
const resultSection = document.querySelector('#result');
const abrevSubst = ['m. pl.', 'f. pl.', 'm.', 'f.','m.  e  adj.', 'f.  e  adj.','m.  e  f.'];
const abrevAdj = ['adj.'];
const abrevAdv = ['adv.'];
const referencias = new Array();
const refSection = document.querySelector('#referencias');
const inScreen = document.querySelector('.in-screen');
const body = document.querySelector('body');
const copyIcon = document.querySelector('#result img');
const substantivoCard = document.querySelector('.cards.substantivo');
const substantivoCardTitle = substantivoCard.querySelector('h5');
const substantivoCardDesc = substantivoCard.querySelector('.card-body > p');
const closeSubstantivoCard = substantivoCard.querySelector('close');
const adjetivoCard = document.querySelector('.cards.adjetivo');
const adjetivoCardTitle = adjetivoCard.querySelector('h5');
const adjetivoCardDesc = adjetivoCard.querySelector('.card-body > p');
const closeAdjetivoCard = adjetivoCard.querySelector('close');
const html = document.querySelector('html');
const radioBtns = [...document.querySelectorAll('input[type="radio"]')];


// GLOBAL VARIABLES
let substs = new Array();
let adjs = new Array();
let wordses = new Array();

const initialColors = {
    v1: getStyle(html, "--v1"),
    v2: getStyle(html, "--v2"),
    v3: getStyle(html, "--v3"),
    v4: getStyle(html, "--v4")
}
const darkMode = {
    v1: "#222",
    v2: "#444",
    v3: "#303030",
    v4: "#555",
    v5: "#fff"
}
const lightMode = {
    v1: "#E0E0E0",
    v2: "#C2C2C2",
    v3: "#D6D6D6",
    v4: "#ADADAD",
    v5: "#000"
}




// METHODS

// 1. Theme methods
function getStyle (element, style) {
    return window
        .getComputedStyle(element)
        .getPropertyValue(style)
}
const changeColors = (colors) => {
    Object.keys(colors).map(key =>{
        html.style.setProperty(`--${key}`,colors[key]);
    })
}
const checkTheme = () => {
    if(document.querySelector('input[type="radio"]:checked').id.includes('dark')){
        changeColors(darkMode);
    } else {
        changeColors(lightMode);
    }
}

// 2. API methods -- call stack de baixo para cima
function addReferencias(refs){
    refs.forEach(ref => {
        refSection.innerHTML += ref;
        referencias.push(ref);
    })
}
function clearFrontRow(table){
    if (table.querySelector('.front')) {
        table.querySelector('.front').className = '';
    }
}
function checkTag(dom,tag){
    return (typeof dom.getElementsByTagName(tag)[0] === 'undefined') ? '' : dom.getElementsByTagName(tag)[0].innerHTML;
}
function classifyOneWord(wordObjects){
    const parser = new DOMParser();
    const newRefs = new Array();
    wordObjects.forEach(wordObj => {
        const xmlStr = wordObj.xml;
        const dom = parser.parseFromString(xmlStr,"application/xml");
        
        if(dom.documentElement.nodeName == "parsererror") return console.log("error while parsing");

        const gramGrp =  checkTag(dom,'gramGrp');
        const orth = checkTag(dom,'orth');
        const def = checkTag(dom,'def');
        const definition = `<p data-ref='${orth}'>${orth} <small>(${gramGrp})</small>${def}</p>`;
        
        //objetivo :: sempre colocar a palavra encontrada por primeiro.
        //Caso for um substantivo, puxar um (outro) adjetivo já existente para completar o par
        
        // const insertHTML = `<tr><td>${orth}</td></tr>`;

        const firstHTML = `<tr class='front'><td>${orth}</td></tr>`;

        let isWordNew = false;
        let newWordType;
        if(abrevSubst.includes(gramGrp)){
            //remove a atual palavra em primeiro lugar, caso a palavra puxada seja não existente
            
            if(!substs.includes(orth)){
                clearFrontRow(substantivoTable);
                isWordNew = true;
                newWordType = 'substantivos';
                substantivoTable.innerHTML+= firstHTML;
                substs.push(orth);
                newRefs.push(definition);
            }
        }  else if(abrevAdj.includes(gramGrp)){
            
            if(!adjs.includes(orth)){
                clearFrontRow(adjetivoTable);
                isWordNew = true;
                newWordType = 'adjetivos';
                adjetivoTable.innerHTML+= firstHTML;
                adjs.push(orth);
                newRefs.push(definition);
            }   
        }

        if(!isWordNew){
            //caso não tenha gerado nenhuma palavra nova, roda a função novamente.
            //dá erro de too much recursion ¯\_(ツ)_/¯
            console.log('não criou nada!',newRefs.length);
            if(substs.length > 0 && adjs.length > 0){
                // classifyOneWord(wordObjects);
                sortButton.click();
            }
            
        } else {
            if(substs.length > 0 && adjs.length > 0){
                //como consegui uma palavra nova de um tipo, devo randomizar entre as existentes do outro
                sortOne(newWordType);
            } 
        }
    })
    addReferencias(newRefs);
}
async function getWordObject(word){
    let wordText = word.word;
    let wordObjects = fetch(classifyURL + wordText);
    return wordObjects;
}
async function getOneWord(){
    let word = fetch(wordsURL)
        .then(res => res.json())
        .then(word => getWordObject(word))
        .then(res => res.json())
        .then(wordObjects => classifyOneWord(wordObjects));
    return word;
}
async function getPair(){
    let iterationWord;
    const limit = 15;
    for(let j = 0; j < (limit + 1); j++){
        if (j > limit) break //safety break
        if(adjs.length > 0 && substs.length > 0) break
        iterationWord = await getOneWord();
        wordses.push( iterationWord );    
    }
    if(adjs.length > 0 && substs.length > 0){
        return true;
    } else {
        getPair();
    }
}

// 3. Front end methods
function enableCloseCards(){
    closeAdjetivoCard.onclick = () => {
        adjetivoCard.classList.remove('active');
    }
    closeSubstantivoCard.onclick = () => {
        substantivoCard.classList.remove('active');
    }
}
function showExcerpt(word){
    const text = document.querySelector(`[data-ref="${word}"]`).innerText;
    return text.length > 181 ? text.substring(0,178) + ' (...)' : text;
}
function showCards(){
    [...document.querySelectorAll('table')].forEach(table => {
        table.onmouseenter = (e) => {
            if(e.target.id == 'substantivos'){
                adjetivoCard.classList.remove('active');
                substantivoCard.classList.add('active');
                const thisWord =  table.querySelector('.front').innerText;
                substantivoCardTitle.innerText = thisWord;
                // substantivoCardDesc.innerText = document.querySelector(`[data-ref="${thisWord}"]`).innerText.substring(0,178) + ' (...)';
                substantivoCardDesc.innerText = showExcerpt(thisWord);
            } else {
                substantivoCard.classList.remove('active');
                adjetivoCard.classList.add('active');
                const thisWord =  table.querySelector('.front').innerText;
                adjetivoCardTitle.innerText = thisWord;
                // adjetivoCardDesc.innerText = document.querySelector(`[data-ref="${thisWord}"]`).innerText.substring(0,178) + ' (...)';
                adjetivoCardDesc.innerText = showExcerpt(thisWord);
            }
        }
    })
}
function clickToCopy(copyElement) {
    /* Select the text field */
    copyElement.select();
    copyElement.setSelectionRange(0, 99999); /*For mobile devices*/
    /* Copy the text inside the text field */
    document.execCommand("copy");
    /* Alert the copied text */
    console.log(copyElement.value);
}

// 3.1 Sorting methods
function l33tsp34k(text){
    let str = text.toLowerCase();
    //remover acentos e caracteres especiais
    const specialChars = {'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Ç':'C','È':'E','É':'E','Ê':'E','Ë':'E','Ì':'I','Í':'I','Î':'I','Ï':'I','Ñ':'N','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ù':'U','Ú':'U','Û':'U','Ü':'U','Ý':'Y','ß':'s','à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ù':'u','ú':'u','û':'u','ü':'u','ý':'y','ÿ':'y','Ā':'A','ā':'a','Ă':'A','ă':'a','Ą':'A','ą':'a','Ć':'C','ć':'c','Ĉ':'C','ĉ':'c','Ċ':'C','ċ':'c','Č':'C','č':'c','Ď':'D','ď':'d','Đ':'D','đ':'d','Ē':'E','ē':'e','Ĕ':'E','ĕ':'e','Ė':'E','ė':'e','Ę':'E','ę':'e','Ě':'E','ě':'e','Ĝ':'G','ĝ':'g','Ğ':'G','ğ':'g','Ġ':'G','ġ':'g','Ģ':'G','ģ':'g','Ĥ':'H','ĥ':'h','Ħ':'H','ħ':'h','Ĩ':'I','ĩ':'i','Ī':'I','ī':'i','Ĭ':'I','ĭ':'i','Į':'I','į':'i','İ':'I','ı':'i','Ĳ':'IJ','ĳ':'ij','Ĵ':'J','ĵ':'j','Ķ':'K','ķ':'k','ĸ':'k','Ĺ':'L','ĺ':'l','Ļ':'L','ļ':'l','Ľ':'L','ľ':'l','Ŀ':'L','ŀ':'l','Ł':'L','ł':'l','Ń':'N','ń':'n','Ņ':'N','ņ':'n','Ň':'N','ň':'n','ŉ':'N','Ŋ':'n','ŋ':'N','Ō':'O','ō':'o','Ŏ':'O','ŏ':'o','Ő':'O','ő':'o','Œ':'OE','œ':'oe','Ŕ':'R','ŕ':'r','Ŗ':'R','ŗ':'r','Ř':'R','ř':'r','Ś':'S','ś':'s','Ŝ':'S','ŝ':'s','Ş':'S','ş':'s','Š':'S','š':'s','Ţ':'T','ţ':'t','Ť':'T','ť':'t','Ŧ':'T','ŧ':'t','Ũ':'U','ũ':'u','Ū':'U','ū':'u','Ŭ':'U','ŭ':'u','Ů':'U','ů':'u','Ű':'U','ű':'u','Ų':'U','ų':'u','Ŵ':'W','ŵ':'w','Ŷ':'Y','ŷ':'y','Ÿ':'Y','Ź':'Z','ź':'z','Ż':'Z','ż':'z','Ž':'Z','ž':'z','ſ':'s'};
    str = str.replace(/[ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝßàáâãäåçèéêëìíîïñòóôõöùúûüýÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ]/g, m => specialChars[m]);
    //leetspeak bois
    const chars = {'a':'4','e':'3','g':'9','i':'1','o':'0','s':'$','t':'7'};
    str = str.replace(/[aeiost]/g, m => chars[m]);
    return str;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function randomPair(array){
    const index = getRandomInt(0,array.length);
    return index;
}
function sortAdjSubs(substs,adjs){
    document.querySelector('#substantivos > tbody > .front').classList.remove('front');
    document.querySelector('#adjetivos > tbody > .front').classList.remove('front');
    const chosenSubst = document.querySelector('#substantivos > tbody').children[randomPair(substs)];
    const chosenAdj = document.querySelector('#adjetivos > tbody').children[randomPair(adjs)];
    chosenSubst.classList.add('front');
    chosenAdj.classList.add('front');
    resultToCopy.value = l33tsp34k(`${chosenSubst.innerText}_${chosenAdj.innerText}`);
}
function sortOne(type){
    //caso veio um type 'substantivos', devo sortear um adjetivo entre os existentes
    const typeOfExisting = type == 'substantivos' ? 'adjetivos' : 'substantivos';
    const etimologiaExisting = type == 'substantivos' ? adjs : substs;
    document.querySelector(`#${typeOfExisting} > tbody > .front`).className = '';
    const chosenWord = document.querySelector(`#${typeOfExisting} > tbody`).children[randomPair(etimologiaExisting)];
    chosenWord.className = 'front';
    resultToCopy.value = l33tsp34k(`${document.querySelector('#substantivos > tbody > .front').innerText}_${document.querySelector('#adjetivos > tbody > .front').innerText}`);
}






// EVENTS
radioBtns.forEach(radioBtn => {
    radioBtn.onclick = (e) => {
        checkTheme();
    }
});
sortButton.onclick = () => {
    // sortAdjSubs(substs,adjs);
    getOneWord();
}
resultSection.onclick = (e) => clickToCopy(resultToCopy);

// FUNCTION CALLS
window.onload = async () => {
    const hasPair = await getPair();
    if(hasPair){
        showCards();
        enableCloseCards();
        // sortButton.addEventListener()
    }
    
}









//backup de funções antes de dar merda
// function classifyOneWord(wordObjects){
//     const parser = new DOMParser();
//     const newRefs = new Array();
//     wordObjects.forEach(wordObj => {
//         const xmlStr = wordObj.xml;
//         const dom = parser.parseFromString(xmlStr,"application/xml");
        
//         if(dom.documentElement.nodeName == "parsererror") return console.log("error while parsing");

//         const gramGrp =  checkTag(dom,'gramGrp');
//         const orth = checkTag(dom,'orth');
//         const def = checkTag(dom,'def');
//         const definition = `<p data-ref='${orth}'>${orth} <small>(${gramGrp})</small>${def}</p>`;
        
//         //objetivo :: sempre colocar a palavra encontrada por primeiro.
//         //Caso for um substantivo, puxar um (outro) adjetivo já existente para completar o par
        
//         const insertHTML = `<tr><td>${orth}</td></tr>`;
//         const firstHTML = `<tr class='front'><td>${orth}</td></tr>`;

//         if(abrevSubst.includes(gramGrp)){
//             if(!substs.includes(orth)){
//                 substs.length == 0 ? substantivoTable.innerHTML+= firstHTML : substantivoTable.innerHTML+= insertHTML;
//                 substs.push(orth);
//                 newRefs.push(definition);
//             }
//         }  else if(abrevAdj.includes(gramGrp)){
//             if(!adjs.includes(orth)){
//                 adjs.length == 0 ? adjetivoTable.innerHTML+= firstHTML : adjetivoTable.innerHTML+= insertHTML;
//                 adjs.push(orth);
//                 newRefs.push(definition);
//             }   
//         }
//     })
//     addReferencias(newRefs);
// }