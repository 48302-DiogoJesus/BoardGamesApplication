// Adjust the input field width according to the input length \\
const searchBar = document.getElementById('search-input')

var prevInput = 0
searchBar.addEventListener('input', () => {
    let currentWidth = 140 || parseInt(searchBar.style.width.replace("px", ""))
    let inputLen = searchBar.value.length
    if (inputLen > 12) {
        searchBar.style.width = currentWidth + ((inputLen - 12) * 10) + 'px';
    } else {
        // Default
        searchBar.style.width = '140px';
    }
    prevInput = inputLen
})