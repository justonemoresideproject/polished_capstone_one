$destArea = document.getElementById('destArea')
$destInfoContainer = document.getElementById('destInfoContainer')
$destCountryName = document.getElementById('countryName')
$countryRows = document.getElementsByClassName('countryRow')
$learnMores = document.getElementsByClassName('learnMore')

async function deleteDestination(country){
    await axios.delete('http://localhost:5001/myDestinations', { data: { country: country } })
}

async function getAllDestinations(){
    res = await axios.get('https://restcountries.com/v3.1/all')

    return res
}

async function getMyDestinations(){
    res = await axios.get('/myDestinations')

    return res
}

async function addDestination(country){
    await axios.post('http://localhost:5001/myDestinations', { country: country })
}

$('button[id^="button_"]').each(function(){
    $(this).click(function(){
        countryCode = this.id.slice(7, this.id.length)
        if(this.className != 'added'){
            addDestination($(`#country_${countryCode}`)[0].innerText)
            this.className = 'added'
            this.innerText = 'Delete Destination'
        } 
        else {
            deleteDestination($(`#country_${countryCode}`)[0].innerText)
            this.className = 'notAdded'
            this.innerText = 'Add Destination'
        }
    });
});

function addDestClick(evt) {
    evtId = evt.id
    
    country = document.getElementById(`country${evtId}`).innerText

    addDestination(country)

    evt.className = 'added'
}

/**
 * Uses location.href to navigate to a page about the country passed to the function.
 * @param {string} country 
 */
function navigateToLearnMore(country) {
    location.href = `/dest/${country}`
}

/**
 * Adds an event listener with function navigateToLearnMore to all buttons with class 'learnMore'
 */
function setAllButtonsOnClick() {
    for(let i = 0; i < $learnMores.length; i++) {
        $learnMores[i].onclick = () => navigateToLearnMore($learnMores[i].id)
    }
}

// https://en.wikipedia.org/w/api.php?action=help&format=json&recursivesubmodules=1&formatversion=2

// async function getWikiText(country) {
//     const url = "https://en.wikipedia.org/w/api.php?" +
//     new URLSearchParams({
//         action: "parse",
//         page: `${country}`,
//         prop: "text",
//         formatversion: "2",
//     });

//     try {
//         const req = await axios.get(url);
//         console.log(req)
//         const json = await req.json();
//         console.log(json.parse.text["*"]);
//     } catch (e) {
//         console.error(e);
//     }
// }

// async function getWikiText(country) {
//     let url = "https://www.mediawiki.org/w/api.php";

//     let params = {
//         action: "query",
//         prop: "revisions",
//         titles: `${country}`,
//         rvprop: "timestamp|user|comment|content",
//         rvslots: "main",
//         formatversion: "2",
//         format: "json"
//     };

//     url = url + "?origin=*";
//     Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

//     await axios.get(url)
//         .then(res => {
//             console.log(res)
//             return res.json();})
//         .then(res => {
//             console.log(res)
//             var pages = res.query.pages;
//             for (var p in pages) {
//                 console.log(pages[p].revisions);
//             }
//         })
//         .catch(function(error){console.log(error);});
// }

function createLearnMoreWindow(country) {
    const backgroundDiv = document.createElement('div')
    const infoContainer = document.createElement('div')
    const countryName = document.createElement('h1')
    const capital = document.createElement('h3')
    const region = document.createElement('h3')
    const subregion = document.createElement('h3')
    const population = document.createElement('h3')

    backgroundDiv.className = 'backgroundObject'
    infoContainer.className = 'destInfoContainer'
    countryName.className = 'countryH1'
    capital.className = 'capitalH3'
    region.className = 'regionH3'
    subregion.className = 'subregionH3'
    population.className ='populationH3'

    backgroundDiv.id = 'backgroundInfoContainer'
    infoContainer.id = `${country}`


}

window.addEventListener('load', (e) => {
    setAllButtonsOnClick()
})