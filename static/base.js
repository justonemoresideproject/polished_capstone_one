const buttons = document.getElementsByClassName("btn")

// Navigation function
function navigateToWebpage(path) {
    location.href = `/${path}`
}

function setAllButtonsOnClick() {
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = () => navigateToWebpage(buttons[i].id)
    }
}

window.addEventListener('load', (e) => {
    setAllButtonsOnClick()
})

console.log(buttons)