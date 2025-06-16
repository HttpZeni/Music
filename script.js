const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const forwardBtn = document.getElementById('forward');
const backwardBtn = document.getElementById('backward');
const progressBar = document.querySelector('.progress-bar');
const volumeSlider = document.getElementById('progress');
const musicContainer = document.getElementById('music-player');
const draggableMusicContainer = document.getElementById('draggable-music-player');
const addContainer = document.querySelector('.add-song');
const draggableAdd = document.getElementById('draggable-add');

let songs = []; 
let selectedSongIndex = 0;
let isPlaying = false;
let isPressed = false;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let isMusicContainer = false;

draggableMusicContainer.addEventListener('mousedown', (e) => {
    console.log('Mouse Down');
    offsetX = e.clientX - musicContainer.offsetLeft;
    offsetY = e.clientY - musicContainer.offsetTop;
    isDragging = true;
    isMusicContainer = true;
})
draggableAdd.addEventListener('mousedown', (e) => {
    console.log('Mouse Down');
    offsetX = e.clientX - addContainer.offsetLeft;
    offsetY = e.clientY - addContainer.offsetTop;
    isDragging = true;
    isMusicContainer = false;
});

document.addEventListener('mousemove', (e) => {
    if(!isDragging) return;

    console.log('Mouse Drag');

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    if(isMusicContainer){
        musicContainer.style.left = x + 'px';
        musicContainer.style.top = y + 'px';
        draggableMusicContainer.style.left = x + 'px';
        draggableMusicContainer.style.top = y + 'px';   
    }
    else if(!isMusicContainer){
        addContainer.style.left = x + 'px';
        addContainer.style.top = y + 'px';
        draggableAdd.style.left = x + 'px';
        draggableAdd.style.top = y + 'px';   
    }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  isMusicContainer = false;
});

function updateSelection() {
    const songElements = document.querySelectorAll('.song-item');
    songElements.forEach((song, index) => {
        song.classList.toggle('selected', index === selectedSongIndex);
    });
}

document.addEventListener('keydown', (event) => {
    const songElements = document.querySelectorAll('.song-item');
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (selectedSongIndex < songElements.length - 1) {
            selectedSongIndex++;
            updateSelection();
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (selectedSongIndex > 0) {
            selectedSongIndex--;
            updateSelection();
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        const selectedSong = songs[selectedSongIndex];
        if (selectedSong) {
            if(!isPressed){
                audio.src = URL.createObjectURL(selectedSong.file);
                audio.play();
                playBtn.textContent = "⏸";
                isPlaying = true;
                isPressed = true;
                document.getElementById('track-title').textContent = selectedSong.name;               
            }
            else{
                audio.pause();
                playBtn.textContent = "▶";
                isPlaying = false;
                isPressed = false;
            }
        }
    }
});

playBtn.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play();
        playBtn.textContent = "⏸";
        isPlaying = true;
        document.getElementById('track-title').textContent = selectedSong.name;
    } else {
        audio.pause();
        playBtn.textContent = "▶";
        isPlaying = false;
    }
});

forwardBtn.addEventListener('click', () => {
    audio.currentTime += 10;
});
backwardBtn.addEventListener('click', () => {
    audio.currentTime -= 10;
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        audio.currentTime += 10;
    }
    else if (event.key === 'ArrowLeft') {
    audio.currentTime -= 10;
  }
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = progressPercent + '%';
    }
});

audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
    playBtn.textContent = "⏸";
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 200;
});

document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];
    if (!file) return alert("No file selected!");

    const songInput = document.getElementById('songName');
    const songList = document.querySelector('.song-list');
    const songName = songInput.value.trim();
    if (!songName) return alert("You have to give it a song name!");

    songs.push({
        name: songName,
        file: file
    });

    const songItem = document.createElement('ul');
    songItem.classList.add('song-item');
    const songIndex = songs.length - 1;

    songItem.addEventListener('click', () => {
        audio.src = URL.createObjectURL(file);
        audio.play();
        playBtn.textContent = "⏸";
        isPlaying = true;
        document.getElementById('track-title').textContent = songName;
        selectedSongIndex = songIndex;
        updateSelection();
    });

    const numberSpan = document.createElement('span');
    numberSpan.classList.add('number');
    numberSpan.textContent = `> ${songs.length} `;

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('title');
    titleSpan.textContent = `- ${songName}`;

    songItem.appendChild(numberSpan);
    songItem.appendChild(titleSpan);
    songList.appendChild(songItem);

    updateSelection();
});
