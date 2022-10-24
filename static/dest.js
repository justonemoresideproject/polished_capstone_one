$destArea = document.getElementById('destArea')
$destInfoContainer = document.getElementById('destInfoContainer')
$destCountryName = document.getElementById('countryName')
$countryRows = document.getElementsByClassName('countryRow')

// https://restcountries.com/v3.1/all

// $testButton = document.getElementById('button')
// $testCountry = document.getElementById('country')

// async function testAddDestination(country){
//     console.log(country)
//     await axios.post(`http://localhost:5001/test`,
//         { country: country  }
//     );
// }

// $testButton.addEventListener('click', function(e){
//     testAddDestination('iraq')
// })

/**
 * Requests and sets flag for each individual country.
 * 
 Sends out promises sequencially rather than all at once in order to make user experience smoother.
 */

// async function setFlags(){
//     // "https://restcountries.com/data/png/col.png"

//     for(let i = 0; i < $countryRows.length; i++) {
//         console.log('test')
//         let image = await axios.get(`https://countryflagsapi.com/png/${$countryRows[i].id}`)
    
//         $countryRows[i].style.backgroundImage = `${image}`
//     }
// }

// function test() {
//     for(let i = 0; i < $countryRows.length; i++) {
//         $countryRows[i].style.backgroundColor = 'red'
//     }
// }

// window.addEventListener('load', (e) => {
//     setFlags()
// })
// async function getDestInfo() {
//     await axios.get()
// }

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
        console.log(this)
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