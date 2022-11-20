// import { getMyDestinations } from "./dest.js"

$playButton = document.getElementById('playButton')
$gameArea = document.getElementById('gameArea')
const gif = document.createElement('img')
gif.setAttribute('id', 'loadingGif')
gif.setAttribute('src', "https://giphy.com/embed/Qc8UoA7NJqx70SfiCL")
// gif.setAttribute('src', 'static/spinner-gif.gif')

let gameOn = false
let score = 0

let myDestinations = []
let destIndex = 0;

async function addScore(){
    const userId = document.getElementsByClassName('userId')[0].id

    await axios.post(`http://localhost:5001/score/${userId}`, { score: score })
}

/**
 * Sends a get request to the rest country api and returns all destinations from the api
 * @returns res object
 */

async function getAllDestinations(){
    res = await axios.get('https://restcountries.com/v3.1/all')

    return res
}

/**
 * Accepts a country that corresponds to the rest countries api and returns the res object from the rest countries api
 * @param {string} country 
 * @returns 
 */

async function getCountry(country){
    res = await axios.get(`https://restcountries.com/v3.1/name/${country}`)

    return res
}

// does not work due to werkzeug. Had to create a work around instead.
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

/**
 * Accepts a number and returns a random number between 0 and the given number.
 * @param {int} length 
 * @returns 
 */

function getRandomNum(length){
    if(length == 1){
        return 0
    }
    return Math.abs(Math.floor(Math.random()*length) - 1)
}

/**
 * Game over function creates an h1 and h3 telling the player their score. Appends the elements to $gameArea
 */

function gameOver() {
    const h1 = document.createElement('h1')
    h1.innerText = 'Game Over!'
    h1.className = 'gameOverHeader'
    h1.id = 'gameOverHeader'

    const h3 = document.createElement('h3')
    h3.innerText = `Your score is ${score}`
    h3.className = 'gameOverScore'
    h3.id = 'gameOverScore'

    console.log('Game Over Function')
    addScore()
    $gameArea.append(h1)
    $gameArea.append(h3)
}

/**
 * Removes the verification window and creates a new table for the user if there are more desinations available. Otherwise it shows the score
 */

function continueGame() {
    verificationContainer = document.getElementById('verificationContainer')
    verificationContainer.remove()

    showLoadingView()

    destIndex++;
    console.log(`Dest Index: ${destIndex}`)
    console.log(`My Destinations Length: ${myDestinations.length}`)
    console.log(`My Destinations: ${myDestinations}`)

    if(destIndex < myDestinations.length) {
        generateQuestions(myDestinations[destIndex]).then(res => {
            createTable(res)
        }).then(res => {
            hideLoadingView(res)
        })
    } else {
        hideLoadingView(null)
        gameOver()
    }
}

/**
 * Accepts a boolean representing whether or not the correct answer was chose, and a string representing the correct answer.
 * @param {boolean} boolean 
 * @param {string} correctAnswer 
 * @returns div
 */

function createVerificationWindow(boolean, correctAnswer) {
    console.log('createVerificationWindow')
    const container = document.createElement('div')
    const window = document.createElement('div')
    const prompt = document.createElement('h2')
    const button = document.createElement('button')
    const message = document.createElement('p')

    container.setAttribute('id', 'verificationContainer')
    container.setAttribute('class', 'verificationContainer')
    
    window.setAttribute('id', 'verificationWindow')
    window.setAttribute('class', 'verificationWindow')

    prompt.setAttribute('id', 'verificationPrompt')
    prompt.setAttribute('class', 'verificationPrompt')

    button.setAttribute('id', 'continueButton')
    button.setAttribute('class', 'continueButton')

    message.setAttribute('id', 'verificationMessage')
    message.setAttribute('class', 'verificationMessage')

    window.append(prompt)
    window.append(message)
    window.append(button)

    button.innerText = 'Continue'

    if(boolean === false) {
        prompt.innerText = 'Incorrect!'
        message.innerText = `The correct answer is ${correctAnswer}`
    } else {
        prompt.innerText = 'Correct!'
        message.innerTex = `Your new score is ${score}`
    }

    container.append(window)

    button.addEventListener("click",() => continueGame())

    return container
}

function verifyAnswer(boolean, correctAnswer) {
    if(boolean === true) {
        score++;
    }
    const verificationWindow = createVerificationWindow(boolean, correctAnswer)

    $gameArea.append(verificationWindow)
}

/**
 * Accepts a country that can be found within the countries api and returns a map with the properties [question], [correctAnswer], and [wrongAnswers]
 * @param {string} country 
 * @returns 
 */

async function generateQuestions(country){
    res = await getCountry(country)
    res2 = await getAllDestinations()

    possibleTopics = ["capital", "population", "region"]
    topic = possibleTopics[getRandomNum(3)]
    question = [`What is the ${topic} of ${res.data[0].name.common}`]

    correctAnswer = [res.data[0][topic]]

    wrongAnswers = []
    
    for(let i = 0; i < 3; i++){
        answer = res2.data[getRandomNum(res2.data.length)][topic]

        if(answer != correctAnswer){
            wrongAnswers.push(answer)
        } else {
            i--
        }
    }

    let newMap = new Map()
    newMap['question'] = question
    newMap['correctAnswer'] = correctAnswer
    newMap['wrongAnswers'] = wrongAnswers

    return newMap

    // return {question: question, correctAnswer: correctAnswer, wrongAnswers: wrongAnswers}
}

/**
 * Accepts the number of questions to be made, the number of answers given per question (one true, the rest false), and the answersPerRow to generate a table.
 * 
 * By default the questions are based on the number of destinations.
 * 
 * By default the number of answers are 4
 * 
 * By default the answersPerRow is 2
 * 
 * @param {number} questions 
 * @param {number} answers
 * @param {number} answersPerRow 
 * @returns table
 */

function createTable(textMap, questions=myDestinations.length, answers=4, answersPerRow=2) {

    // Top Element Creation
    const newTable = document.createElement('table')
    const thead = document.createElement('thead')
    const tbody = document.createElement('tbody')
    const headTr = document.createElement('tr')
    const questionTd = document.createElement('td')
    const prompt = document.createElement('h3')

    newTable.id = 'gameTable'
    questionTd.id = 'question'
    thead.id = 'gameHead'
    tbody.id = 'gameBody'

    newTable.className = 'gameTable'
    thead.className = 'gameHead'
    tbody.className = 'gameBody'
    headTr.className = 'questionRow'
    questionTd.className = 'questionContainer'

    prompt.innerText = textMap.question.pop()

    questionTd.append(prompt)
    headTr.append(questionTd)
    thead.append(headTr)
    newTable.append(thead)
    newTable.append(tbody)

    const numRows = Math.ceil(answers / answersPerRow)

    function bodyElementsCreation() {
        for(let i = 0; i < numRows; i++) {
            const trElement = document.createElement('tr')
            for(let j = i * answersPerRow; j < answersPerRow + i * answersPerRow; j++) {
                const tdElement = document.createElement('td')
                const buttonElement = document.createElement('button')

                const randNum = getRandomNum(answers)
                const rightAnswer = textMap.correctAnswer[0]

                if(textMap.correctAnswer.length !== 0 && randNum === j || textMap.wrongAnswers.length === 0) {
                    buttonElement.id = `correctAnswer`
                    buttonElement.addEventListener("click", () => verifyAnswer(true, rightAnswer))
                    buttonElement.innerText = textMap.correctAnswer.pop()

                } else {
                    buttonElement.id = `wrongAnswer${j + i}`
                    buttonElement.innerText = textMap.wrongAnswers.pop()
                    buttonElement.addEventListener("click", () => verifyAnswer(false, rightAnswer))
                }
                buttonElement.className = 'answerButton'
                tdElement.id = `answer${j + i}`
                tdElement.className = `answerContainer`

                tdElement.append(buttonElement)
                trElement.append(tdElement)
            }
            tbody.append(trElement)
        }
    }

    bodyElementsCreation()

    return newTable
}

/**
 * removes the Game Table element if needed and appends the loading gif to the Game Area
 *
 */
function showLoadingView(){
    if(document.getElementById('loadingGif')){
        console.log('return')
        return
    } else if(document.getElementById('gameTable')){
        gameTable = document.getElementById('gameTable')
        gameTable.remove()
    } else {
        $gameArea.append(gif)
    }
}

/**
 * Removes the loading gif if applicaple and then appends the accepted table element to the game area
 * @param {table} gameTable 
 */
function hideLoadingView(gameTable){
    loadingGif = document.getElementById('loadingGif')
    if(loadingGif !== null) { 
        loadingGif.remove()
    }
    if(gameTable !== null && gameTable !== undefined) {
        try {
            $gameArea.append(gameTable)
        } catch (error) {
            console.log(error)
        }
    }
}

/**
 * Accepts the destination object from the sql server.
 * @param {object} res 
 */

// Due to being unable to get sql information from server using js, a work around had to be created. This is now obsolete 
// function pushDests(res){
//     for(i = 0; i < res.data.length; i++){
//         myDestinations.push(res.data[i].country_name)
//     }
// }

/**
 * Takes the h3 elements with the class of destContainer and pushes them to the myDestinations array.
 */

function pushDests() {
    const elements = document.getElementsByClassName("destContainer")
    
    for(let i = 0; i < elements.length; i++){
        myDestinations.push(elements[i].id)
    }
}

async function startGame() {
    showLoadingView()
    console.log('after showLoadingView()')
    destIndex = 0;

    pushDests()
    await generateQuestions(myDestinations[destIndex]).then(res => {
        console.log('before hideLoadingView')
        hideLoadingView(createTable(textMap=res))
    }).catch(err => {
        console.error(err)
    })
}

// Obsolete
// if(gameOn){
//     $('td[id^="answer_"]').each(function(){
//         $(this).click(function(){
//             destsIndex++
//             if(this.innerText == obj["correctAnswer"]){
//                 alert('Correct!')
//                 score++; 
//             } 
//             else{
//                 alert('Incorrect!')
//             }
    
//             if(destsIndex >= myDestinations.length){
//                 alert('Game Over!')
//                 gameOn = false

//             } else {
//                 generateQuestions(myDestinations[destsIndex])
//                     .then(obj => addText(obj))
//                     .catch(err => alert(err))
//             }
//         })
//     })
// }


$playButton.addEventListener('click', function(){
    if(this.className == 'startButton'){
        this.innerText = 'Reset'
        this.className = 'resetButton'
        startGame()
    } else {
        document.getElementById('gameTable').remove()
        startGame()
    }
})