// import { getMyDestinations } from "./dest.js"

$playButton = document.getElementById('playButton')
$gameArea = document.getElementById('gameArea')
const gif = document.createElement('img')
gif.setAttribute('id', 'loadingGif')
gif.setAttribute('src', 'static/spinner-gif.gif')

gameOn = false
score = 0

const myDests = []

// This function will find the destinations the user has added and create questions about them. 
// This will be done by using axios to find the destinations within my own api, 

async function addScore(score){
    await axios.post('http://localhost:5001/score', { score: score})
}

async function getAllDestinations(){
    res = await axios.get('https://restcountries.com/v3.1/all')

    return res
}

async function getCountry(country){
    res = await axios.get(`https://restcountries.com/v3.1/name/${country}`)

    return res
}

async function getMyDestinations(){
    res = await axios.get('http://localhost:5001/myDestinations')

    return res
}

function testAddDestinations(){
    res = getMyDestinations()
    newh3 = document.createElement('h3')
    newh3.innerText = res.data
    $gameArea.append(newh3)
}

function getRandomNum(length){
    if(length == 1){
        return 0
    }
    return Math.abs(Math.round(Math.random()*length) - 1)
}

async function generateQuestions(country){
    res = await getCountry(country)
    res2 = await getAllDestinations()

    possibleTopics = ["capital", "population", "region"]
    topic = possibleTopics[getRandomNum(3)]
    question = `What is the ${topic} of ${res.data[0].name.common}`

    correctAnswer = res.data[0][topic]

    wrongAnswers = []
    
    for(let i = 0; i < 3; i++){
        answer = res2.data[getRandomNum(res2.data.length)][topic]

        if(answer != correctAnswer){
            wrongAnswers.push(answer)
        } else {
            i--
        }
    }

    return {question: question, correctAnswer: correctAnswer, wrongAnswers: wrongAnswers}
}

function createTable(){
    // Element Creation
    newTable = document.createElement('table')
    thead = document.createElement('thead')
    tbody = document.createElement('tbody')
    trOne = document.createElement('tr')
    trTwo = document.createElement('tr')
    trThree = document.createElement('tr')
    td_1 = document.createElement('td')
    td_2 = document.createElement('td')
    td_3 = document.createElement('td')
    td_4 = document.createElement('td')
    td_5 = document.createElement('td')
    button_0 = document.createElement('button')
    button_1 = document.createElement('button')
    button_2 = document.createElement('button')
    button_3 = document.createElement('button')

    // Element Id
    newTable.id = 'gameTable'
    thead.id = 'gameHead'
    tbody.id = 'gameBody'
    trOne.id = 'topRow'
    trTwo.id = 'middleRow'
    trThree.id = 'botRow'
    td_1.id = 'question'
    button_0.id = 'answer_0'
    button_1.id = 'answer_1'
    button_2.id = 'answer_2'
    button_3.id = 'answer_3'

    // Element Text
    td_1.innerText = 'Prompt'
    button_0.innerText = 'Answer'
    button_1.innerText = 'Answer'
    button_2.innerText = 'Answer'
    button_3.innerText = 'Answer'

    // Element Class
    newTable.className = 'hidden'
    thead.className = 'gameHead'
    tbody.className = 'gameBody'
    trOne.className = 'promptRow'
    trTwo.className = 'topQuestions'
    trThree.className = 'botQuestions'
    td_1.className = 'question'
    td_2.className = 'answerContainer'
    td_3.className = 'answerContainer'
    td_4.className = 'answerContainer'
    td_5.className = 'answerContainer'
    button_0.className = 'answer'
    button_1.className = 'answer'
    button_2.className = 'answer'
    button_3.className = 'answer'

    // Element Appending
    td_2.append(button_0)
    td_3.append(button_1)
    td_4.append(button_2)
    td_5.append(button_3)
    trThree.append(td_4, td_5)
    trTwo.append(td_3, td_2)
    trOne.append(td_1)
    tbody.append(trThree, trTwo)
    thead.append(trOne)
    newTable.append(thead)
    newTable.append(tbody)

    $gameArea.append(newTable)

}

function addText(obj){
    document.getElementById('question').innerText = obj["question"]
    answers = [obj["correctAnswer"], obj["wrongAnswers"][0], obj["wrongAnswers"][1], obj["wrongAnswers"][2]]

    for(i = 0; i < 4; i++){
        console.log(answers)
        randNum = getRandomNum(answers.length)
        a = document.getElementById(`answer_${i}`)
        a.innerText = answers[randNum]
        answers.splice(randNum, 1)
        console.log(answers)
    }

    hideLoadingView()

    return answers
}

function showLoadingView(){
    if(document.getElementById('gif')){
        return
    } else if(document.getElementById('gameTable')){
        $gameArea.children[0].remove()
    }
    $gameArea.append(gif)
}

function hideLoadingView(){
    $gameArea.children[0].remove()
    $gameArea.children[0].className = 'gameTable'
}

function pushDests(res){
    for(i = 0; i < res.data.length; i++){
        myDests.push(res.data[i].country_name)
    }
}

async function playGame(){
    gameOn = true
    obj = {}
    destsIndex = 0
    score = 0
    showLoadingView()
    createTable()
    await getMyDestinations().then(res => pushDests(res))
    
    await generateQuestions(myDests[destsIndex])
        .then(obj => addText(obj))
        .catch(err => console.log(err)) 
}

if(gameOn){
    $('td[id^="answer_"]').each(function(){
        $(this).click(function(){
            destsIndex++
            if(this.innerText == obj["correctAnswer"]){
                alert('Correct!')
                score++; 
            } 
            else{
                alert('Incorrect!')
            }
    
            if(destsIndex >= myDests.length){
                alert('Game Over!')
                gameOn = false

            } else {
                generateQuestions(myDests[destsIndex])
                    .then(obj => addText(obj))
                    .catch(err => alert(err))
            }
        })
    })
}


$playButton.addEventListener('click', function(){
    if(this.className == 'startButton'){
        this.innerText = 'Reset'
        this.className = 'resetButton'
        playGame()
    } else {
        document.getElementById('gameTable').remove()
        playGame()
    }
})