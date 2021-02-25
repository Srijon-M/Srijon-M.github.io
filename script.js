const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

//search song
// function searchSong(term){
//     fetch(`${apiURL}/suggest/${term}`)
//         .then(res => res.json())
//         .then(data => console.log(data));
// }

async function searchSong(term){
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    showData(data);
}

//Show lyrics and artist data in dom
function showData(data){
    let output = '';
    data.data.forEach(song => {
        output += `
            <li>
                <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">
                    Get Lyrics
                </button>
            </li>
        `
    });
    result.innerHTML = `
        <ul class="songs">
            ${output}
        </ul>
    `
    if(data.next || data.prev){
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Previous</button>` : ''}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `
    }else{
        more.innerHTML = '';
    }
}


//Get more songs by next or previous
async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    console.log(data);
    showData(data);
}

//get song lyrics
async function getLyrics(artist, songtitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songtitle}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>' );
    result.innerHTML = `
        <h2><strong>${artist}</strong> ${songtitle}</h2>
        <span>${lyrics}</span>
    `;
    more.innerHTML = '';
}

//event listners
form.addEventListener('submit', e => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if(!searchTerm){
        alert('Please enter song name or artist');
    }else{
        searchSong(searchTerm);
    }
});

//Get lyrics button click

result.addEventListener('click', (e) => {
    const clickedEl = e.target;
    if(clickedEl.tagName === 'BUTTON'){
        const artist = clickedEl.getAttribute('data-artist');
        const songtitle = clickedEl.getAttribute('data-songtitle');
        getLyrics(artist, songtitle);
    }
});