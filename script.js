//Creo variables para la lista de canciones y los botones
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
//Creo una lista de canciones. Cada cancion es un objeto
const allSongs = [
    {
        id: 0,
        title: "Only the fallen",
        artist: "Zeli",
        duration: "3:15",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/642/only-the-fallen-1709773265-8PbAKzv7oS.mp3",
    },
    {
        id: 1,
        title: "Sharks",
        artist: "Zeli",
        duration: "3:10",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/347/sharks-1678150841-gL3IK37MiW.mp3",
    },
    {
        id: 2,
        title: "What's the problem",
        artist: "OSKI",
        duration: "2:28",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/583/whats-the-problem-1702551656-evxTC7URyG.mp3",
    },
    {
        id: 3,
        title: "Stay the night",
        artist: "OSKI",
        duration: "2:47",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/523/stay-the-night-1694131252-jcmJYic5WA.mp3",
    },
    {
        id: 4,
        title: "Karma",
        artist: "Alaina Cross",
        duration: "3:09",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/564/karma-1699578053-M8wfhj548e.mp3",
    },
    {
        id: 5,
        title: "Gone for Good",
        artist: "Riva, Jim Yosef, Alaina Cross",
        duration: "3:01",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/573/rival-jim-yosef-alaina-cross-1701424856-ugduvOQs47.mp3",
    },
    {
        id: 6,
        title: "No rival",
        artist: "Alaina Cross, Maestro Chives, Egzod",
        duration: "3:18",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/122/no-rival-1651226438-1CBwH9EN4k.mp3",
    },
    {
        id: 7,
        title: "Lonely way",
        artist: "Rival, Caravn",
        duration: "3:44",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/838/1602924116_i3Tn2EkNdU_Rival---Lonely-Way-ft.-Caravn-NCS-Release.mp3",
    },
    {
        id: 8,
        title: "Falling",
        artist: "Rival, CRVN",
        duration: "3:35",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/113/falling-1649412038-s66KBvyTjg.mp3",
    },
    {
        id: 9,
        title: "Superhero In My Sleep",
        artist: "Rival, Asketa, Natan Chaim",
        duration: "3:06",
        src: "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/012/superhero-in-my-sleep-1632488435-LTrTsOu6F8.mp3",
    },
];
//Defino una variable para usar la API Audio()
const audio = new Audio();
//Creo una copia de la lista de canciones para que no se pierda nada si el usuario la modifica
let userData = {
    songs: [...allSongs], /// ... copia todos los elementos de un array
    currentSong: null,
    songCurrentTime: 0,
};
//Agrego la función que reproduce las canciones
const playSong = (id) => {
    //Creo una variable song buscando entre los elementos de songs por el id
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src; //Le doy al audio el src del song encontrado
    audio.title = song.title; //Le doy al audio el título del song encontrado
    //Si la cancion no era la canción actual
    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
        audio.currentTime = 0; //Se reproduce desde el principio
    } else {
        audio.currentTime = userData?.songCurrentTime; //Si no, se reproduce desde donde estaba (Si estaba pausado, por ejemplo)
    }
    userData.currentSong = song;
    playButton.classList.add("playing"); //Le cambio el estilo al botón de play
    highlightCurrentSong(); //Resaltar la cancion en curso
    setPlayerDisplay(); //Mostrar texto en pantalla
    setPlayButtonAccessibleText();
    audio.play(); //Uso la API para reproducir audio
};
//Agrego la funcion para pausar
const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    playButton.classList.remove("playing");
    audio.pause();
};
//Funcion para la siguiente cancion
const playNextSong = () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        const currentSongIndex = getCurrentSongIndex();
        const nextSong = userData?.songs[currentSongIndex + 1];
        playSong(nextSong.id);
    }
};
//Funcion para la cancion anterior
const playPreviousSong = () =>{
    if (userData?.currentSong === null) return;
    else {
        const currentSongIndex = getCurrentSongIndex();
        const previousSong = userData?.songs[currentSongIndex - 1];
        playSong(previousSong.id);
    }
};
//Funcion mezcla aleatoria
const shuffle = () => {
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    renderSongs(userData?.songs);
    pauseSong(); 
    setPlayerDisplay();
    setPlayButtonAccessibleText();
};
//Función delete
const deleteSong = (id) => {
    if (userData?.currentSong?.id === id) {
        userData.currentSong = null;
        userData.songCurrentTime = 0;
        pauseSong();
        setPlayerDisplay();
    }
    userData.songs = userData?.songs.filter((song) => song.id !== id);
    renderSongs(userData?.songs);
    highlightCurrentSong();
    setPlayButtonAccessibleText();
    //Agregar botón de restaurar cuando no queden canciones
    if (userData?.songs.length === 0) {
        const resetButton = document.createElement("button");
        const resetText = document.createTextNode("Reset Playlist");
        resetButton.id = "reset";
        resetButton.ariaLabel = "Reset playlist";
        resetButton.appendChild(resetText);
        playlistSongs.appendChild(resetButton);
        resetButton.addEventListener("click", () => {
            userData.songs = [...allSongs];
            renderSongs(sortSongs()); 
            setPlayButtonAccessibleText();
            resetButton.remove();
        });
}
};
//Funcion para mostrar el texto en pantalla
const setPlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
    playingSong.textContent = currentTitle ? currentTitle : "";
    songArtist.textContent = currentArtist ? currentArtist : "";
};
//Funcion para resaltar la cancion que está sonando
const highlightCurrentSong = () => {
    const playlistSongElements = document.querySelectorAll(".playlist-song");
    const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);
    playlistSongElements.forEach((songEl) => {
        songEl.removeAttribute("aria-current");
    });
    if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};
//Uso una función de flecha para agregar las canciones y su información a la lista del reproductor
const renderSongs = (array) => {
    const songsHTML = array
        .map((song)=> {
        return `
            <li id="song-${song.id}" class="playlist-song">
                <button class="playlist-song-info" onclick="playSong(${song.id})">
                    <span class="playlist-song-title">${song.title}</span>
                    <span class="playlist-song-artist">${song.artist}</span>
                    <span class="playlist-song-duration">${song.duration}</span>
                </button>
                <button class="playlist-song-delete" aria-label="Delete ${song.title}" onclick="deleteSong(${song.id})">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
                </button>
            </li>
            `;
        }).join("");

    playlistSongs.innerHTML = songsHTML;
};
//Texto del boton play
const setPlayButtonAccessibleText = () => {
    const song = userData?.currentSong || userData?.songs[0];
    playButton.setAttribute("aria-label", song?.title ? `Play ${song.title}` : "Play");
};
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong); //Obtiene el indice de la cancion actual
//Creo el Event Listener para el boton de play
playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    }else {
        playSong(userData?.currentSong.id);
    }
});
//Creo el Event Listener para el botón de pausa, siguiente y anterior, mezcla aleatoria
pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click",  playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);
//Agrego un evento de cancion finalizada para pasar a la siguiente
audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
        if (nextSongExists) {
            playNextSong();
        } else {
            userData.currentSong = null;
            userData.songCurrentTime = 0;  
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
    }
});
//Oredeno la lista alfabéticamente
const sortSongs = () => {
    userData?.songs.sort((a,b) => {
        if (a.title < b.title) {
            return -1;
        }

        if (a.title > b.title) {
            return 1;
        }

        return 0;
    });

    return userData?.songs;
};
//Aplico la función que ordena la lista
renderSongs(sortSongs());
