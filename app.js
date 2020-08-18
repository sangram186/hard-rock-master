const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', getLyrics);

const searchLyrics = document.getElementById('search-lyrics');
searchLyrics.addEventListener('focus', removeResult);

// Getting Lyrics information

function getLyrics() {
  fetch(`https://api.lyrics.ovh/suggest/${searchLyrics.value}`)
  .then(response => response.json())
  .then(data =>  getResult(data));
  searchLyrics.value = '';
  showLyrics.innerHTML = '';

}

// Showing result according to search.
function getResult(data){
  let finalResults = [];
  let seenResults = [];
  data.data.forEach(result => {
    if (seenResults.length >= 10) {
      return;
    }
    var titleMain = result.title + ' - ' + result.artist.name;

    seenResults.push(titleMain);
    finalResults.push({
      display: titleMain,
      artist: result.artist.name,
      title: result.title,
      cover: result.album.cover_big,
      mp3: result.preview
    });
  });

    showResult(finalResults);
}
// Made the variable global because I have to remove old lyrics after searching for new songs
let showLyrics = document.getElementById('fancy-lyrics');
function showResult(data){
    // fancy result
    for(let i = 0; i < data.length; i++){
      const searchResult = document.getElementById('fancy-result');
      const singleResult = document.createElement('div');
      singleResult.classList.add('single-result', 'row', 'align-items-center', 'my-3', 'p-3');
      //creating div
      const columnDefine = document.createElement('div');
      columnDefine.classList.add('col-md-9');
      columnDefine.innerHTML = `<a href='${data[i].mp3}'>Download the Song>></a>`;
      // creating h3 
      const h3 = document.createElement('h3');
      h3.classList.add('lyrics-name');
      h3.innerText = `${data[i].title}`;
      columnDefine.appendChild(h3);

      // creating p element
      const p = document.createElement('p');
      p.classList.add('author','lead');
      p.innerHTML = `Album by <span>${data[i].artist}</span>`;
      columnDefine.appendChild(p);

      singleResult.appendChild(columnDefine);
      // creating button
      const btnDiv = document.createElement('div');
      btnDiv.classList.add('col-md-3','text-md-right','text-center');
      const button = document.createElement('button');
      button.classList.add('btn','btn-success','get-lyrics-fancy');
      button.innerText = 'Get Lyrics';
      btnDiv.appendChild(button);

      singleResult.appendChild(btnDiv);
      searchResult.appendChild(singleResult);
      // singleResult.style.transition = 'all 5s ease-in';
    }
    // Get lyrics Button
    const getLyricsButton = document.querySelectorAll('.get-lyrics-fancy');
    getLyricsButton.forEach(e => {
      e.addEventListener('click', k => {
        const fancyLyricsTitle = k.target.parentElement.parentElement.children[0].children[1].innerText;
        const fancyLyricsArtist = k.target.parentElement.parentElement.children[0].children[2].children[0].innerText;
        
        document.getElementById('lyrics-title').innerText = `${fancyLyricsTitle} -by- ${fancyLyricsArtist}`;
        fetch(`https://api.lyrics.ovh/v1/${fancyLyricsArtist.toLowerCase()}/${fancyLyricsTitle.toLowerCase()}`) 
        .then(response => response.json())
        .then(data => {
          showLyrics.innerHTML = `${data.lyrics.replace(/\n/g, '<br />')}`;
        })
        .catch(err => {
          const lyricsTitle = document.getElementById('lyrics-title');
          lyricsTitle.innerText = 'Lyrics Not Found, Try Another One';
          let showLyrics = document.getElementById('fancy-lyrics');
          showLyrics.innerHTML = '';
        })
      })
    })
}
// If input fields value less then two the all suggestion will remove..
const suggestion = document.getElementById('fancy-result');
function removeResult(){
  suggestion.innerHTML = '';
}