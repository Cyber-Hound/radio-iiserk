readApiFile("/api/news.json", loadNews);

function loadNews(arguments) {
    var res = JSON.parse(this.responseText);
    const featuredNews = res.data.featured;
    const allNews = res.data["all-news"];
    buildFeatured(featuredNews.data);
    buildAllNews(allNews.data, allNews.hasNext);
}

function buildFeatured(newsData) {
    const newsWrapper = document.getElementById("newsSwiper-wrapper");
    newsData.forEach(newsElement => {
        var child = document.createElement("div");
        child.setAttribute("class", "swiper-slide news-slide");
        child.innerHTML = `<img class="newsImage" src="${newsElement.thumbnail}" alt="thumb" >
        <div style="background-color: rgba(0,0,0,0.7);" class="mask ps-3">
            <div class="text-white text-center text-md-end mt-2 mx-2 mx-md-3 fw-bold issue-font">
            <i>${newsElement.month}</i>&#160\;&#160\;${newsElement.year}&#160\;&#160\;&#160\;<i>Volume</i>&#160\;&#160\;${newsElement.volume}&#160\;&#160\;&#160\;<i>Issue</i>&#160\;&#160\;${newsElement.issue}
            </div>
            <div class="fw-bold mt-1 mt-md-4 ms-2 ms-md-3 text-white-50 issue-font">
                The Campus Radio news Letter
            </div>
            <div class="ms-2 text-white about-heading" style="font-weight:700;">
                ABHIVAHYA
            </div>
            <b class="px-2 py-2 landing-subheading ms-2 rounded-4" style="background-color: rgba(255,255,255,0.5); color: rgb(200,0,0);">
                ${newsElement.title}
            </b>
            <div class="text-end">
                <a class="me-3 me-md-4 mb-3 mb-md-4 px-1 py-1 fs-6 rounded-2" style="background-color: rgba(255,255,255,0.9); color: rgb(10,10,10); font-weight: 900; position:absolute; right:0; bottom:0"
                href="${newsElement.link}"
                >
                Read Here
                </a>
            </div>
        </div>
        `
        newsWrapper.appendChild(child);
    });
    newsSwiperInit();
}

function newsSwiperInit() {
    const newsSwiper = new Swiper(
    ".newsSwiper",
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

function buildAllNews(allData, hasNext) {
    const listContainer = document.getElementById("bottomList");
    listContainer.innerHTML = '';
    allData.forEach(singleData => {
        var child = document.createElement("div");
        child.setAttribute("class", "col-6 col-md-4 col-lg-3 p-4");
        child.innerHTML = `
        <div class="news-slide">
        <img class="newsImage rounded-8" src="${singleData.thumbnail}" alt="thumb" >
        </div>
        <div class="px-2 py-2 text-center fw-bold text-white">${singleData.title}</div>
        `;
        child.onclick = function (event) {
            var bottomListContainer =document.getElementById("bottomList")
            bottomListContainer.children.forEach(sib => {
                sib.classList.remove("active");
            });
            this.classList.add("active");
            buildCurrent(singleData);
            window.scrollTo(0, 0);
        }
        listContainer.appendChild(child);

    });

    if (hasNext) {
        var loadMore = document.createElement("div");
        loadMore.setAttribute("class", "col-6 col-md-4 col-lg-3 p-4");
        loadMore.innerHTML = `
        <div class="news-slide rounded-8 text-white text-center" style="background-color:rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.5)">
        <i class="fas fa-spinner fa-2x" id="spinner" style="position:absolute; left:50%; top:50%; transform: translate(-50%,-50%);"></i>
        </div>
        <div class="px-2 py-2 text-center fw-bold text-white">Load More</div>
        `;
        loadMore.onclick = function (event) {
            // load More Data
        }
        listContainer.appendChild(loadMore);
    }
}
