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
const radioBtns = [...document.querySelectorAll('input[type="radio"]')];
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

getWords();
checkTheme();
enableCloseCards();
showCards();
function enableCloseCards(){
    closeAdjetivoCard.onclick = () => {
        adjetivoCard.classList.remove('active');
    }
    closeSubstantivoCard.onclick = () => {
        substantivoCard.classList.remove('active');
    }
}
function showCards(){
    [...document.querySelectorAll('table')].forEach(table => {
        table.onmouseenter = (e) => {
            if(e.target.id == 'substantivos'){
                adjetivoCard.classList.remove('active');
                substantivoCard.classList.add('active');
                const thisWord =  table.querySelector('.front').innerText;
                substantivoCardTitle.innerText = thisWord;
                substantivoCardDesc.innerText = document.querySelector(`[data-ref="${thisWord}"]`).innerText;
            } else {
                substantivoCard.classList.remove('active');
                adjetivoCard.classList.add('active');
                const thisWord =  table.querySelector('.front').innerText;
                adjetivoCardTitle.innerText = thisWord;
                adjetivoCardDesc.innerText = document.querySelector(`[data-ref="${thisWord}"]`).innerText;
            }
        }
    })

}
function checkTheme(){
    if(document.querySelector('input[type="radio"]:checked').id.includes('dark')){
        body.classList.remove('light');
        body.classList.add('dark');
        inScreen.classList.remove('light');
        inScreen.classList.add('dark');
        copyIcon.src = "copy-white.png";
    } else {
        body.classList.add('light');
        body.classList.remove('dark');
        inScreen.classList.add('light');
        inScreen.classList.remove('dark');
        copyIcon.src = "copy.png";
    }
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
function sortAdjSubs(substs,adjs){
    document.querySelector('#substantivos > tbody > .front').classList.remove('front');
    document.querySelector('#adjetivos > tbody > .front').classList.remove('front');
    const chosenSubst = document.querySelector('#substantivos > tbody').children[randomPair(substs)];
    const chosenAdj = document.querySelector('#adjetivos > tbody').children[randomPair(adjs)];
    chosenSubst.classList.add('front');
    chosenAdj.classList.add('front');
    resultToCopy.value = l33tsp34k(`${chosenSubst.innerText}${chosenAdj.innerText}`);
}
function l33tsp34k(text){
    let str = text.toLowerCase();
    //remover acentos e caracteres especiais
    const specialChars = {'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Ç':'C','È':'E','É':'E','Ê':'E','Ë':'E','Ì':'I','Í':'I','Î':'I','Ï':'I','Ñ':'N','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ù':'U','Ú':'U','Û':'U','Ü':'U','Ý':'Y','ß':'s','à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ù':'u','ú':'u','û':'u','ü':'u','ý':'y','ÿ':'y','Ā':'A','ā':'a','Ă':'A','ă':'a','Ą':'A','ą':'a','Ć':'C','ć':'c','Ĉ':'C','ĉ':'c','Ċ':'C','ċ':'c','Č':'C','č':'c','Ď':'D','ď':'d','Đ':'D','đ':'d','Ē':'E','ē':'e','Ĕ':'E','ĕ':'e','Ė':'E','ė':'e','Ę':'E','ę':'e','Ě':'E','ě':'e','Ĝ':'G','ĝ':'g','Ğ':'G','ğ':'g','Ġ':'G','ġ':'g','Ģ':'G','ģ':'g','Ĥ':'H','ĥ':'h','Ħ':'H','ħ':'h','Ĩ':'I','ĩ':'i','Ī':'I','ī':'i','Ĭ':'I','ĭ':'i','Į':'I','į':'i','İ':'I','ı':'i','Ĳ':'IJ','ĳ':'ij','Ĵ':'J','ĵ':'j','Ķ':'K','ķ':'k','ĸ':'k','Ĺ':'L','ĺ':'l','Ļ':'L','ļ':'l','Ľ':'L','ľ':'l','Ŀ':'L','ŀ':'l','Ł':'L','ł':'l','Ń':'N','ń':'n','Ņ':'N','ņ':'n','Ň':'N','ň':'n','ŉ':'N','Ŋ':'n','ŋ':'N','Ō':'O','ō':'o','Ŏ':'O','ŏ':'o','Ő':'O','ő':'o','Œ':'OE','œ':'oe','Ŕ':'R','ŕ':'r','Ŗ':'R','ŗ':'r','Ř':'R','ř':'r','Ś':'S','ś':'s','Ŝ':'S','ŝ':'s','Ş':'S','ş':'s','Š':'S','š':'s','Ţ':'T','ţ':'t','Ť':'T','ť':'t','Ŧ':'T','ŧ':'t','Ũ':'U','ũ':'u','Ū':'U','ū':'u','Ŭ':'U','ŭ':'u','Ů':'U','ů':'u','Ű':'U','ű':'u','Ų':'U','ų':'u','Ŵ':'W','ŵ':'w','Ŷ':'Y','ŷ':'y','Ÿ':'Y','Ź':'Z','ź':'z','Ż':'Z','ż':'z','Ž':'Z','ž':'z','ſ':'s'};
    str = str.replace(/[ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝßàáâãäåçèéêëìíîïñòóôõöùúûüýÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ]/g, m => specialChars[m]);
    //leetspeak bois
    const chars = {'a':'4','e':'3','i':'1','o':'0'};
    str = str.replace(/[aeio]/g, m => chars[m]);
    return str;
}
function randomizeArray(array){
    const iStart = array.length - 1;
    for(let i = iStart; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
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
function apiGet(method){
    let reqs = new Array();
    for (let i = 0; i < method; i++){
        reqs.push(fetch(wordsURL));
    }
    Promise.all(reqs)
    .then(responses => {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }))
    })
    .then(data => {
        pwdResult.innerText = '';
        data.map(function (response) {
            pwdResult.innerText+=response.word
        })
    })
}
function getWords(){
    let reqs = new Array();
    for (let i = 0; i < 20; i++){
        reqs.push(fetch(wordsURL));
    }
    Promise.all(reqs)
    .then(responses => {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }))
    })
    .then(data => {
        // pwdResult.innerText = '';
        data.map(function (response) {
            randomResultBox.innerHTML+=`<span>${response.word}</span>`;
        })
        classifyWords();
    })
}
function classifyWords(){
    let reqs = new Array();
    const substs = new Array();
    const adjs = new Array();
    const words = [...randomResultBox.children];
    words.forEach(word => {
        reqs.push(fetch(classifyURL + word.innerText));
    });
    Promise.all(reqs)
    .then(responses => {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }))
    })
    .then(data => {
        data.map(function (response) {
            response.forEach(r => {
                const xmlStr = r.xml;
                const parser = new DOMParser();
                const dom = parser.parseFromString(xmlStr, "application/xml");
                if(dom.documentElement.nodeName == "parsererror"){
                    console.log("error while parsing");
                } else {
                    const gramGrp = (typeof dom.getElementsByTagName('gramGrp')[0] === 'undefined') ? '' : dom.getElementsByTagName('gramGrp')[0].innerHTML;
                    const orth = (typeof dom.getElementsByTagName('orth')[0] === 'undefined') ? '' : dom.getElementsByTagName('orth')[0].innerHTML;
                    console.log(gramGrp + " ----- " + orth);
                    const def = (typeof dom.getElementsByTagName('def')[0] === 'undefined') ? '' : dom.getElementsByTagName('def')[0].innerHTML;
                    const definition = `<p data-ref='${orth}'>${orth} <small>(${gramGrp})</small>${def}</p>`;
                    const insertHTML = `<tr><td>${orth}</td></tr>`;
                    const firstHTML = `<tr class='front'><td>${orth}</td></tr>`
                    if(abrevSubst.includes(gramGrp)) {
                        if(!substs.includes(orth)){
                            substs.length == 0 ? substantivoTable.innerHTML+= firstHTML : substantivoTable.innerHTML+= insertHTML;
                            substs.push(orth);
                            referencias.push(definition);
                        }
                    } else if(abrevAdj.includes(gramGrp)){
                        if(!adjs.includes(orth)){
                            adjs.length == 0 ? adjetivoTable.innerHTML+= firstHTML : adjetivoTable.innerHTML+= insertHTML;
                            adjs.push(orth);
                            referencias.push(definition);
                        }   
                    }
                }
            })
        })
        referencias.forEach(ref => {
            refSection.innerHTML += ref;
        })
        resultToCopy.value = l33tsp34k(`${substs[0]}${adjs[0]}`);
        sortButton.onclick = () => {
            sortAdjSubs(substs,adjs);
            getStrenght(resultToCopy.value);
        }
        resultSection.onclick = (e) => clickToCopy(resultToCopy);
    })
    .catch(err => {
        console.error(err);
    })
}
function getStrenght(pwd){
    console.log(zxcvbn(pwd));
}
radioBtns.forEach(radioBtn => {
    radioBtn.onclick = (e) => {
        checkTheme();
    }
});
