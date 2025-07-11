console.log("lets write java script")
let currentsong = new Audio();
let songs;
let currfolder;
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/spotifymusic/${folder}/`)
    let response = await a.text()
    // console.log(response)
    // 
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as)
    // 
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }
    }
    // show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
               <img class="invert" src="/spotifymusic/img/music.svg" alt="">
                            <div class="info">
                               <div>${song.replaceAll("%20", "")}</div>
                            </div>
                            <!--  -->
                            <div class="playnow"> 
                            <span>Play Now</span>
                             <img class="invert" src="/spotifymusic/img/playbutton.svg" alt="">
                            </div>  </li>`;

    }
    //    Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {

            //    console.log(e.querySelector(".info").firstElementChild.innerHTML)

            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    // console.log(songs)
    return songs;

}
const playmusic = (track, pause = false) => {
    // let audio = new Audio("/spotifymusic/mp3/"+track)
    currentsong.src = `/spotifymusic/${currfolder}/` + track;
    // audio.play() 
    if (!pause) {
        currentsong.play()
        play.src = "/spotifymusic/img/pause.svg"
    }
    //   
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}
// seconds to minutes function by gpt
function secondsToMinutesSeconds(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:3000/spotifymusic/mp3/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardconainer = document.querySelector(".cardcontainer")
    console.log(anchors)
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];



        if (e.href.includes("/mp3")) {
            // Get the metadata of the folder
            // console.log(e.href.split("/").slice(-2)[0])
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/spotifymusic/mp3/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardconainer.innerHTML = cardconainer.innerHTML + `<div data-folder ="${folder}" class="card">
                        <div class="play">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    fill="#00">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <img src="/spotifymusic/mp3/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(e)
            console.log(item.currentTarget, item.target.dataset)
            songs = await getsongs(`mp3/${item.currentTarget.dataset.folder}`)
            //first song will play when the card is clicked
            playmusic(songs[0])

        })
    })
}

async function main() {

    // Get the list of all songs
    await getsongs("mp3/ncs")
    playmusic(songs[0], true)
    // console.log(songs)

    // Display all the albums on the page
    displayalbums()


    //    attach an event listener to play ,next and previous song
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "/spotifymusic/img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "/spotifymusic/img/playbutton.svg"
        }
    })
    // listen for time-update function 
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        //   for seek bar moving
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    // add an event-listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").
            style.left = percent + "%";
        // console.log(e.offsetX/target.getBoundingClientRect().width)*100 +"%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    // add an event listener for hamberger 
    document.querySelector(".hamberger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Add an event listener to previous 
    previous.addEventListener("click", () => {
        console.log("previosly clicked ")
        console.log(currentsong)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    // Add an event listener to next 
    next.addEventListener("click", () => {
        currentsong.pause();
        play.src = "/spotifymusic/img/playbutton.svg"
        console.log("next clicked ")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to:", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100;
        if(currentsong.volume >0)
        {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
    })

    // add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log("changing", e.target)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace
                ("volume.svg","mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg",
                "volume.svg")
            currentsong.volume = .10;
             document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
}
main()

