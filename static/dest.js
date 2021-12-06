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

// async function addDestToDestArea(){
//     allDests = await getAllDestinations()

//     // this code looks ugly
//     myDests = await getMyDestinations()
//     justDests = {}
//     for(i = 0; i < myDests.data.length; i++){
//         justDests[myDests.destination.country_name] = 1
//     }
    

//     for(i = 0; i < allDests.data.length; i++){
//         // Element creation
//         newTr = document.createElement('tr')
//         button = document.createElement('button')
//         countryTd = document.createElement('td')
//         capitalTd = document.createElement('td')
//         regionTd = document.createElement('td')
//         subregionTd = document.createElement('td')
//         populationTd = document.createElement('td')

//         // Element class change
//         // if(justDests[allDests.data[i].name.common] != undefined){
//         //     button.className = 'added'
//         // } else {
//         //     button.className = 'notAdded'
//         // }
//         countryTd.className = 'tableCell'
//         capitalTd.className = 'tableCell'
//         regionTd.className = 'tableCell'
//         subregionTd.className = 'tableCell'
//         populationTd.className = 'tableCell'

//         // Element id change
//         button.id = `${i}`
//         countryTd.id = `country${i}`
//         capitalTd.id = `capital${i}`
//         regionTd.id = `region${i}`
//         subregionTd.id = `subregion${i}`
//         populationTd.id = `population${i}`

//         // Element text change
//         button.innerText = 'Add to your board'
//         countryTd.innerText = allDests.data[i].name.common
//         capitalTd.innerText = allDests.data[i].capital[0]
//         regionTd.innerText = allDests.data[i].region
//         subregionTd.innerText = allDests.data[i].subregion
//         populationTd.innerText = allDests.data[i].population

//         // Adding event listener to button
//         button.addEventListener('click', this.addDestClick.bind(this))

//         // Element appending
//         newTr.append(countryTd, capitalTd, regionTd, subregionTd, populationTd)

//         destArea.append(newTr)
//     }
// }

// addDestToDestArea()