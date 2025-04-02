// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('.current');
const cdThumb = $('.cd-thumb'); 
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');


const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
  
    songs: [
        {
        name: "Tháng tư là lời nói dối của em",
        singer: "Hà Anh Tuấn",
        path: "./assets/audio/ThangTuLaLoiNoiDoiCuaEm-HaAnhTuan.mp3",
        image: "./assets/img/thang_tu_la_loi_noi_doi_cua_em.jpg"
        },
        {
        name: "Dù Cho Tận Thế",
        singer: "ERIK",
        path: "./assets/audio/DuChoTanThe-Erik.mp3",
        image: "./assets/img/du_cho_tan_the.jpg"
        }, 
        {
        name: "Lạc Trôi",
        singer: "Sơn Tùng M-TP",
        path: "./assets/audio/LacTroi-SonTungMTP.mp3",
        image: "./assets/img/lac_troi.jpg"
        },
        {
        name: "Nơi Này Có Anh",
        singer: "Sơn Tùng M-TP",
        path: "./assets/audio/NoiNayCoAnh-SonTungMTP.mp3",
        image: "./assets/img/noi_nay_co_anh.jpg"
        },
        {
        name: "Hãy Trao Cho Anh",
        singer: "Sơn Tùng M-TP ft. Snoop Dogg",
        path: "./assets/audio/HayTraoChoAnh-SonTungMTP.mp3",
        image: "./assets/img/hay_trao_cho_anh.jpg"
        },
        {
        name: "Chúng Ta Của Hiện Tại",
        singer: "Sơn Tùng M-TP",
        path: "./assets/audio/ChungTaCuaHienTai-SonTungMTP.mp3",
        image: "./assets/img/chung_ta_cua_hien_tai.jpg"
        },
        
        
    ],

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return`
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phong to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        // Xử lý khi click play button
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        // Khi bài hát được play
        audio.onplay = function(){
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play(); // Bắt đầu quay CD
        }

        // Khi bài hát bị pause
        audio.onpause = function(){
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause(); // Dừng quay CD
        }

        // Xử lý lỗi khi tệp âm thanh không thể phát
        audio.onerror = function () {
            console.error("Error: Cannot play the current audio source.");
            alert("The current audio source cannot be played. Please check the file or try another song.");
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                $('#progress').value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát   
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next song
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong();
            }else{
                app.nextSong();
            }
            audio.play();
            app.render();
            this.scrollToActiveSong();
        }

        // Khi prev song
        prevBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong();
            }else{
                app.prevSong();
            }
            audio.play();
            app.render();
            this.scrollToActiveSong(); 
        }

        // Khi random song
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }

        // Khi repeat song
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        // Khi kết thúc bài hát
        audio.onended = function(){
            if(app.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }

        // Khi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                // Xử lý khi click vào bài hát
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
                // Xử lý khi click vào option
                if(e.target.closest('.option')){
                    console.log('Option clicked');
                }
            }
        }
        
    },

    // Xử lý phát ngẫu nhiên bài hát
    playRandomSong: function(){
        let newIndex;
        do{ 
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // Cuộn đến bài hát đang phát
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },

    // Tải thông tin bài hát hiện tại
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    // Xử lý khi next song
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    // Xử lý khi prev song
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    start: function(){
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();
    }
}

app.start();