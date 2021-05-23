var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://cyber-hound.github.io/radio-iiserk/api/team.json");
      xhr.addEventListener('load', processJSON);
      xhr.send();
      var obj;

      function processJSON(event) {
        var json = this.responseText;
        obj = JSON.parse(json);
        var wrapper = document.getElementById("teamPics");
        obj["data"].forEach(element => {
          var child = document.createElement("div");
          child.setAttribute("class", "swiper-slide rounded-3 shadow-5-strong");
          child.innerHTML = `<img class="rounded-3" src ="https://cyber-hound.github.io/radio-iiserk${element["image"]}" alt="${element["name"]}" width="100%">`;
          wrapper.appendChild(child);
        });
        gallery (obj);
      }

      function gallery (res) {

      var swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        mousewheel: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        loop: true,
        on: {
          slideChange: function (){
            setData(this.realIndex);
          },
          init: function() {
            setData(0);
          }
        }
      });
      function setData(index) {
        var nameEle = document.getElementById("memberName");
            var postEle = document.getElementById("memberPost");
            var desiEle = document.getElementById("memberDesignation");
            var quoteEle = document.getElementById("memberQuote");
            nameEle.innerHTML = `${res["data"][index]["name"]}`;
            postEle.innerHTML = `${res["data"][index]["post"]}`;
            desiEle.innerHTML = `${res["data"][index]["designation"]}`;
            quoteEle.innerHTML = `"${res["data"][index]["quote"]}"`;
      }
    }
