const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const preBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Always Remember Us This Way",
      singer: "Lady Gaga",
      path: "/assets/audio/AlwaysRememberUsThisWay-LadyGaga-5693911.mp3",
      image: "/assets/img/1.jpg",
    },
    {
      name: "Shallow",
      singer: "Lady Gaga",
      path: "/assets/audio/Shallow-Lady-Gaga_ Bradley-Cooper.mp3",
      image: "/assets/img/2.jpg",
    },
    {
      name: "I Never Love Again",
      singer: "Lady Gaga",
      path: "/assets/audio/ILlNeverLoveExtendedVersionRadioEdit-LadyGaga-5693922.mp3",
      image: "/assets/img/3.jpg",
    },
    {
      name: "Heal Me",
      singer: "Lady Gaga",
      path: "/assets/audio/healme.mp3",
      image: "/assets/img/4.jpg",
    },
    {
      name: "Before I Cry",
      singer: "Lady Gaga",
      path: "/assets/audio/BeforeICry-LadyGaga-5693918.mp3",
      image: "/assets/img/5.png",
    },
    {
      name: "Too Far Gone",
      singer: "Bradley Cooper",
      path: "/assets/audio/toofar.mp3",
      image: "/assets/img/6.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
              <div class="song">
                  <div
                    class="thumb"
                    style="
                      background-image: url('${song.image}');
                    "
                  ></div>
                  <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
                </div>
      `;
    });

    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    //X??? l?? thu ph??ng CD
    const cdWidth = cd.offsetWidth;
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDWidth = cdWidth - scrollTop > 0 ? cdWidth - scrollTop : 0;
      cd.style.width = newCDWidth + "px";
      cd.style.opacity = newCDWidth / cdWidth;
    };

    //X??? l?? xoay cd

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    //X??? l?? khi click playlist
    playBtn.onclick = function () {
      if (!app.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    // Khi ph??t
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    //Khi d???ng
    audio.onpause = function () {
      player.classList.remove("playing");
      app.isPlaying = false;
      cdThumbAnimate.pause();
    };

    //Ti???n ????? b??i h??t thay ?????i
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressCurrent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressCurrent;
      }
    };

    //X??? l?? khi tua
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //X??? l?? khi prev b??i
    preBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandom();
      } else {
        app.prevSong();
      }
      audio.play();
    };

    //X??? l?? khi next b??i
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandom();
      } else {
        app.nextSong();
      }
      audio.play();
    };

    //X??? l?? b???t ng???u nhi??n
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };

    //X??? l?? next song khi audio ended
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.onclick();
      }
    };

    //X??? l?? repeat song
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  playRandom: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    //?????nh ngh?? c??c thu???c t??nh cho Object
    this.defineProperties();

    //X??? l?? c??c s??? ki???n
    this.handleEvent();

    //T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
    this.loadCurrentSong();

    //render playlist
    this.render();
  },
};

app.start();
