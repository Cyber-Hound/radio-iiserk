var xhr = new XMLHttpRequest();
xhr.open("GET", "https://cyber-hound.github.io/radio-iiserk/api/videos.json");
xhr.addEventListener('load', processReq);
xhr.send();

function processReq(event) {
    var res = JSON.parse(this.responseText);
    const featuredData = res.featured;
    const upcommingEventsData = res.data.events.upcomming;
    const availableEventsData = res.data.events.available;
    const upcommingPodcastsData = res.data.podcasts.upcomming;
    const availablePodcastsData = res.data.podcasts.available;

    if (featuredData != {} || featuredData != null) buildCurrent(featuredData);
    if (upcommingEventsData!=null && upcommingEventsData.length != 0) buildUpcoming("eventSwiper","eventSwiper-wrapper",upcommingEventsData);
    if (upcommingEventsData!=null && availableEventsData.length != 0) buildAvailable("eventListContainer", availableEventsData);
    if (upcommingPodcastsData!=null && upcommingPodcastsData.length != 0) buildUpcoming("podcastSwiper","podcastSwiper-wrapper",upcommingPodcastsData);
    if (upcommingPodcastsData!=null && availablePodcastsData.length != 0) buildAvailable("podcastListContainer", availablePodcastsData);
}

function buildCurrent(playingData) {
    // select Elements
    const currentTitle = document.getElementById("currentTitle");
    const currentEmbed = document.getElementById("currentEmbed");
    const currentDescription = document.getElementById("currentDescription");

    currentTitle.innerHTML = playingData.title;
    currentDescription.innerHTML = playingData.description;
    const ytID = getYTId(playingData.link);
    currentEmbed.setAttribute("src", `https://www.youtube.com/embed/${ytID}`);
}

function buildUpcoming(swiperClass,swiperWrapperClass, ueData) {
    const swiperWrapper = document.getElementById(swiperWrapperClass);

    ueData.forEach(singleData => {
        var child = document.createElement("div");
        child.setAttribute("class", "swiper-slide");
        child.innerHTML = `<img src="https://cyber-hound.github.io/radio-iiserk${singleData.thumbnail}" alt="thumb" >
        <div style="position: absolute; bottom:0; left:0; width:100%; backdrop-filter: blur(25px)"><div class="px-2 py-2 text-white">${singleData.title}<p style="font-size: 0.8em; font-style:italic; white-space: nowrap; width: 100%; overflow: hidden; -o-text-overflow: ellipsis; text-overflow:ellipsis;">${singleData.description}</p></div></div>
        `
        swiperWrapper.appendChild(child);
    });
    eventSwiperInit("."+swiperClass);
}

function eventSwiperInit(params) {
    const eventSwiper = new Swiper(
    params,
        {
            centeredSlides: true,
            loop: true,
            mousewheel:true,
            pagination: {
                el: '.swiper-pagination',
                dynamicBullets: true,
            },
            autoplay: {
            delay: 5000,
            disableOnInteraction: false
            },
        },
    );
}

function buildAvailable(listClass, aeData) {
    const listContainer = document.getElementById(listClass);
    aeData.forEach(singleData => {
        var child = document.createElement("div");
        child.setAttribute("class", "list-group-item d-flex justify-content-between align-items-start customListItem");
        child.innerHTML = `
        <div class="ms-2 me-auto">
            <div class="fw-bold" style="font-size:0.9em">${singleData.title}</div>
        </div>
        <div class="justify-self-end align-self-center ms-1" style="">
            <img style="vertical-align: middle;
        height: 50px;" src="https://img.youtube.com/vi/${getYTId(singleData.link)}/default.jpg" alt="" class="rounded-3"/>
        </div>`;
        child.onclick = function (event) {
            document.getElementsByClassName("customList").forEach(ele => {
                ele.children.forEach(sib => {
                    sib.classList.remove("active");
                });
            });
            this.classList.add("active");
            buildCurrent(singleData);
            window.scrollTo(0, 0);
        }
        listContainer.appendChild(child);
    });
}

function getYTId(url) {
    var ytRegExp = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/;
    var result = url.match(ytRegExp);
    return result[3];
}
