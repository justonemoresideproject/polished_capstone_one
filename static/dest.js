$destArea = document.getElementById('destArea')
$destInfoContainer = document.getElementById('destInfoContainer')
$destCountryName = document.getElementById('countryName')
$countryRows = document.getElementsByClassName('countryRow')
$learnMores = document.getElementsByClassName('learnMore')

async function deleteDestination(country){
    await axios.delete('http://localhost:5000/myDestinations', { data: { country: country } })
}

async function getAllDestinations(){
    res = await axios.get('https://restcountries.com/v3.1/all')

    return res
}

async function getMyDestinations(){
    res = await axios.get('/myDestinations')

    return res
}

/**
 * Accepts a country string and sends a post request to the flask server to add the country to the user's destination table
 * @param {string} country 
 */
async function addDestination(country){
    await axios.post('http://localhost:5000/myDestinations', { country: country })
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

/**
 * Accepts an event and sets the class of the event element as added
 * @param {element} evt 
 */
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

/**
 * Accepts a string and returns a div element that gives more information on the passed country
 * @param {string} country 
 */
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