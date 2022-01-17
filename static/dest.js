$destArea = document.getElementById('destArea')

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