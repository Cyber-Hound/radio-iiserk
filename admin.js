(function () {
    hidecontent();
    const email = document.getElementById('loginmail');
    const pass = document.getElementById('loginpass');
    const err = document.getElementById('loginerror');
    const login = document.getElementById('sign-in');
    // initialize
    var firebaseConfig = {
        apiKey: "AIzaSyDV_gDmID_MIwB9VPBeYrJDavGb8o7FjDI",
        authDomain: "lasttry-b125b.firebaseapp.com",
        databaseURL: "https://lasttry-b125b-default-rtdb.firebaseio.com",
        projectId: "lasttry-b125b",
        storageBucket: "lasttry-b125b.appspot.com",
        messagingSenderId: "947695574275",
        appId: "1:947695574275:web:31f87fb4868edfd5759d36"
    };
    firebase.initializeApp(firebaseConfig);

    login.addEventListener('click', e => {
        const auth = firebase.auth();
        console.log(email.value, pass.value)
        auth.signInWithEmailAndPassword(email.value, pass.value)
            .then(val => {
                err.innerText = '';
            })
            .catch(e => {
                err.innerText = e.message;
            });
    });

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            showcontent();
        } else {
            hidecontent();
        }
    });
})();

var db = firebase.database();
var str = firebase.storage();
var storage = str.ref();
var vidRes;
var newsRes;
var allVids = [];
var allNews = [];
var featuredNews = [];
var descriptionTF = new SimpleMDE({
    element: document.getElementById("videoDescriptionTF"),
    toolbar: ["bold", "italic", "unordered-list", "ordered-list", "|", "link", "preview"],
});
var videoForm = document.getElementById("videoForm");
var newsForm = document.getElementById("newsForm");
var isDirty = false;

window.onbeforeunload = function (e) {
    if (!isDirty) {
        return null;
    }

    var confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
}
window.onload = () => {
    db.ref('videos/').once('value',(snapshot) => {
    const data = snapshot.val();
    loadVideoList(data)
    });
    db.ref('newsletter/').once('value',(snapshot) => {
    const data = snapshot.val();
    loadNewsList(data)
    });
}
function loadVideoList(data) {
    if (data != null) {
        vidRes = data;
        setupVideoTable(vidRes);
    }
}
function loadNewsList(data) {
    if (data != null) {
        newsRes = data;
        setupNewsTable(newsRes);
    }
}
function publish() {
    if (vidRes.data != null) {
        if (vidRes.featured == null) vidRes.featured = allVids[0]
    }
    if (allNews.length != 0) {
        if (newsRes.data['featured'].count == 0) newsRes.data['featured'].data = new Array(allNews[0]);
    }
    if(vidRes)
    db.ref('videos/').set(vidRes).then(res => {
        markDirty(false);
        setupVideoTable(vidRes);
    });

    if(newsRes)
    db.ref('newsletter/').set(newsRes).then(res => {
        markDirty(false);
        setupNewsTable(newsRes);
    });
}
function setupVideoTable(data) {
    allVids = [];
    if (data != null && data.data != null) {
        if (data.data.events != null) {
            if (data.data.events.upcomming !=null) data.data.events.upcomming.forEach((d) => allVids.push(d));
            if (data.data.events.available !=null) data.data.events.available.forEach((d) => allVids.push(d));
        }
        if (data.data.podcasts != null) {
            if (data.data.podcasts.upcomming !=null) data.data.podcasts.upcomming.forEach((d) => allVids.push(d));
            if (data.data.podcasts.available !=null) data.data.podcasts.available.forEach((d) => allVids.push(d));
        }
    }


    var tbody = document.getElementById("videoTable");
    tbody.innerHTML = '';
    allVids.forEach((ele)=>tbody.appendChild(videoListRowGen(ele)))
}
function videoListRowGen(data) {
    var isFeatured = (vidRes.featured) ? (data.id === vidRes.featured.id) : false;

    var trow = document.createElement("tr");
    if (isFeatured) trow.style = 'background-color: #ccffcc';
    var link = data.isUpcoming ? data.thumbnail : data.link;
    var linktext = data.isUpcoming ? "ThumbNail - " + data.thumbnail : "YT Link - " + data.link;
    var titletext = data.title;
    trow.innerHTML = `<th scope="row"> ${data.id.length >= 8 ? data.id.substring(0,8).concat("...") : data.id}</th>
    <td>${data.type==1 ? "Event" : "Podcast"}</td>
    <td>${isFeatured? '<span class="badge rounded-pill bg-success">Featured</span>' : ""} ${titletext.length >= 50 ? titletext.substring(0,50).concat("...") : titletext}</td>
    <td><h5>${(!data.isUpcoming)? '<span class="badge rounded-pill bg-success">Yes</span>':'<span class="badge rounded-pill bg-danger">No</span>'}</h5></td>
    <td><a href="${link}" target="_blank" rel="noopener noreferrer"> ${linktext.length >= 50 ? linktext.substring(0,50).concat("...") : linktext}</a></td>
    <td><i class="m-2 fas fa-edit text-primary fa-lg btn" onclick="navigateToVideo('${data.id}', 'update', ${isFeatured}, true)"></i><i class="m-2 fas fa-trash-alt text-danger fa-lg btn" onclick="confirmdeleteVideos('${data.id}')"></i></td>
    `;
    return trow;
}
function backToAllContent() {
    navigateToVideo(undefined, 'add', undefined, false);
    setupVideoTable(vidRes);
    navigateToNews(undefined, 'add', undefined, false);
    setupNewsTable(newsRes);
    mdb.Tab.getInstance(document.querySelector("#nav-link1")).show();
}
function backToAllVideos() {
    navigateToVideo(undefined, 'add', undefined, false);
    setupVideoTable(vidRes);

    mdb.Tab.getInstance(document.querySelector("#nav-link1")).show();
    mdb.Tab.getInstance(document.querySelector('#tab-videos')).show();
}
function backToAllNews() {
    navigateToNews(undefined, 'add', undefined, false);
    setupNewsTable(newsRes);

    mdb.Tab.getInstance(document.querySelector("#nav-link1")).show();
    mdb.Tab.getInstance(document.querySelector('#tab-news')).show();
}
function navigateToVideo(vidID, mode, isFeatured, frwd) {
    const ham = document.getElementById('ham-btn');
    if (frwd === true) {
        mdb.Tab.getInstance(document.querySelector("#nav-link2")).show();
    }
    if (!ham.classList.contains('collapsed')) ham.click();


    if (mode === "update") {
        var vidData = allVids.find(item => item.id === vidID)
        document.getElementById("id-input").value = vidID;
        document.getElementsByName("videoType").forEach((ele) => {
            if (ele.value === vidData.type) ele.checked = true;
        })
        document.getElementById("videoTitle").value = vidData.title;
        descriptionTF.value(TurndownService().turndown(vidData.description));
        document.getElementsByName("videoAvailable").forEach((ele) => {
            if (ele.value === vidData.isUpcoming.toString()) ele.checked = true;
            toggleVideoDataVisibility(vidData.isUpcoming);
        if (vidData.isUpcoming) {
            var thumbLinkEle = document.getElementById("thumb-link");
            thumbLinkEle.value = vidData.thumbnail;
            document.getElementById("img-preview").src = vidData.thumbnail;
        } else {
            var ytLinkEle = document.getElementById("yt-link");
            ytLinkEle.value = vidData.link;
        }
            document.getElementById("is-featured").checked = isFeatured;
    })
    } else {
        document.getElementById("id-input").value = uuidv4();
        document.getElementsByName("videoType")[0].checked = true;
        document.getElementById("videoTitle").value = '';
        descriptionTF.value('');
        document.getElementsByName("videoAvailable")[0].checked = true;
        toggleVideoDataVisibility(true);
        document.getElementById("img-preview").src = '';
        document.getElementById("thumb-link").value = '';
        document.getElementById("yt-link").value = '';
        document.getElementById("is-featured").checked = true;
    }
}
function toggleVideoDataVisibility(isUpcoming) {
    document.getElementsByClassName("vid-data-tab").forEach(element => {
        element.classList.remove("show","active");
    });

    if (isUpcoming) {
        document.getElementById("thumb-data-tab").classList.add("show", "active");
        document.getElementById("yt-link").required = false;
        document.getElementById("submit-btn").disabled = (document.getElementById("thumb-link").value != '') ? false : true;
    } else {
        document.getElementById("yt-link-tab").classList.add("show", "active");
        document.getElementById("yt-link").required = true;
        document.getElementById("submit-btn").disabled = false;
    }
}
if (videoForm) {
    videoForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        var validResult = validate();
        setVidResponse(validResult);
        })
}
if (newsForm) {
    newsForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        var validResult = validateN();
        setNewsResponse(validResult);
        })
}
function uploadThumb(files) {
    if (files[0] == null) return;
    const fileName = document.getElementById("id-input").value.substring(0, 15);
        // .concat(files[0].name.substring(files[0].name.lastIndexOf('.')));
    storage.child(fileName).put(files[0]).then(snap => {
        snap.ref.getDownloadURL().then(url => {
            document.getElementById("thumb-link").value = url;
            document.getElementById("img-preview").src = url;
            document.getElementById("submit-btn").disabled = false;
        });
    });

}
function uploadNewsThumb(files) {
    if (files[0] == null) return;
    const fileName = document.getElementById("id-input-n").value.substring(0, 15);
        // .concat(files[0].name.substring(files[0].name.lastIndexOf('.')));
    storage.child(fileName).put(files[0]).then(snap => {
        snap.ref.getDownloadURL().then(url => {
            document.getElementById("n-thumb-link").value = url;
            document.getElementById("n-img-preview").src = url;
            document.getElementById("n-submit-btn").disabled = false;
        });
    });
}
function validate() {
    var vidID = document.getElementById("id-input").value;
    var titleEle = document.getElementById("videoTitle");
    var vidTitle = markdown(titleEle.value).replace(/(<([^>]+)>)/gi,'');
    var vidDescription = markdown(descriptionTF.value());
    var vidType;
    var isUpcoming;
    var vidLink;
    var thumbLink;
    document.getElementsByName("videoType").forEach((ele) => {
        if (ele.checked) vidType = parseInt(ele.value);
    })
    document.getElementsByName("videoAvailable").forEach((ele) => {
        if (ele.checked) isUpcoming = ele.value == "true" ? true : false;
        if (isUpcoming) {
            thumbLink = document.getElementById("thumb-link").value;
            vidLink = "";
        } else {
            var ytLinkEle = document.getElementById("yt-link");
            thumbLink = document.getElementById("thumb-link").value || 'https://via.placeholder.com/480x270?text=IISER-K+Radio';
            vidLink = ytLinkEle.value;
        }
    })
    var setFeatured = document.getElementById("is-featured").checked;

    return {vidID, vidTitle, vidDescription, isUpcoming, vidLink, thumbLink, vidType, setFeatured}
}
function setVidResponse(res) {
    var id = res.vidID;
    var structuredData = {
        "id": res.vidID,
        "title": res.vidTitle,
        "description": res.vidDescription,
        "link": res.vidLink,
        "type": res.vidType,
        "isUpcoming": res.isUpcoming,
        "thumbnail": res.thumbLink
    }


    var allVidsIndex = allVids.findIndex(item => item.id === id);
    if (allVidsIndex != -1) {
        allVids[allVidsIndex] = structuredData;
    } else {
        allVids.push(structuredData);
    }

    var featuredD;
    if (res.setFeatured) {
        featuredD = structuredData
    } else {
        featuredD = (res.vidID === vidRes.featured.id) ? null : vidRes.featured;
    }

    var ue = allVids.filter(item => item.type === 1 && item.isUpcoming === true);
    var ae = allVids.filter(item => item.type === 1 && item.isUpcoming === false);
    var up = allVids.filter(item => item.type === 2 && item.isUpcoming === true);
    var ap = allVids.filter(item => item.type === 2 && item.isUpcoming === false);

    vidRes = {
        "status": "OK",
        "featured": featuredD,
        "data": {
            "events": {
                "upcomming": ue,
                "available": ae,
            },
            "podcasts": {
                "upcomming": up,
                "available": ap,
            }
        }
    }
    backToAllVideos();
    markDirty(true);
}
function confirmdeleteVideos(id) {
    const mymodal = new mdb.Modal(document.getElementById('confirmDiag'));
    var confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.addEventListener('click', (eve) => {
        deleteVideo(id);
        mymodal.hide();
    });
    mymodal.show();
}
function deleteVideo(id) {
    var allVidsIndex = allVids.findIndex(item => item.id === id);
    if (allVidsIndex != -1) allVids.splice(allVidsIndex, 1);

    var featuredD = (id === vidRes.featured.id) ? null : vidRes.featured;

    var ue = allVids.filter(item => item.type === 1 && item.isUpcoming === true);
    var ae = allVids.filter(item => item.type === 1 && item.isUpcoming === false);
    var up = allVids.filter(item => item.type === 2 && item.isUpcoming === true);
    var ap = allVids.filter(item => item.type === 2 && item.isUpcoming === false);

    vidRes = {
        "status": "OK",
        "featured": featuredD,
        "data": {
            "events": {
                "upcomming": ue,
                "available": ae,
            },
            "podcasts": {
                "upcomming": up,
                "available": ap,
            }
        }
    }
    setupVideoTable(vidRes);

    mdb.Tab.getInstance(document.querySelector("#nav-link1")).show();
    mdb.Tab.getInstance(document.querySelector('#tab-videos')).show();

    markDirty(true);
}
function markDirty(dirty) {
    if (dirty) {
        isDirty = true;
        document.getElementById("publish-btn").disabled = false;
        document.getElementById("warning-save").hidden = false;
    } else {
        isDirty = false;
        document.getElementById("publish-btn").disabled = true;
        document.getElementById("warning-save").hidden = true;
    }
}
function setupNewsTable(data) {
    allNews = [];
    if (data != null && data.data != null) {
        if (data.data['all-news'].data != null) allNews = data.data['all-news'].data;
        if (data.data['featured'].data != null) featuredNews = data.data['featured'].data;
    }


    var tbody = document.getElementById("newsTable");
    tbody.innerHTML = '';
    allNews.forEach((ele)=>tbody.appendChild(newsListRowGen(ele)))
}
function newsListRowGen(data) {
    var isFeatured;
    if (featuredNews.length > 0) {
        var i = featuredNews.findIndex(item => item.id === data.id);
        if (i > -1) {
            isFeatured = true;
        } else isFeatured = false;
    }

    var trow = document.createElement("tr");
    if (isFeatured) trow.style = 'background-color: #ccffcc';
    var link = data.link;
    var linktext = "Link - " + data.link;
    var thumblink = data.thumbnail;
    var titletext = data.title;
    trow.innerHTML = `<th scope="row"> ${data.id.length >= 8 ? data.id.substring(0,8).concat("...") : data.id}</th>
    <td>${'Issue ' + data.issue + ' Vol.' + data.volume + '  ' + data.month + ' ' + data.year}</td>
    <td>${isFeatured? '<span class="badge rounded-pill bg-success">Featured</span>' : ""} ${titletext.length >= 50 ? titletext.substring(0,50).concat("...") : titletext}</td>
    <td><a href="${link}" target="_blank" rel="noopener noreferrer"> ${linktext.length >= 50 ? linktext.substring(0,50).concat("...") : linktext}</a></td>
    <td><div class="thumbContainer rounded-3"><a href="${thumblink}" target="_blank" rel="noopener noreferrer"> <img src="${thumblink}" width="100px"/></a></div></td>
    <td><i class="m-2 fas fa-edit text-primary fa-lg btn" onclick="navigateToNews('${data.id}', 'update', ${isFeatured}, true)"></i><i class="m-2 fas fa-trash-alt text-danger fa-lg btn" onclick="confirmdeleteNews('${data.id}')"></i></td>
    `;
    return trow;
}
function navigateToNews(newsID, mode, isFeatured, frwd) {
    const ham = document.getElementById('ham-btn');
    if (frwd === true) mdb.Tab.getInstance(document.querySelector("#nav-link3")).show();
    if (!ham.classList.contains('collapsed')) ham.click();

    if (mode === "update") {
        var newsData = allNews.find(item => item.id === newsID)
        document.getElementById("id-input-n").value = newsID;
        document.getElementById("issue-number").value = newsData.issue;
        document.getElementById("issue-volume").value = newsData.volume;
        document.getElementById("issue-month").value = newsData.month;
        document.getElementById("issue-year").value = newsData.year;
        document.getElementById("issue-head").value = newsData.heading;
        document.getElementById("issue-title").value = newsData.title;
        document.getElementById("n-img-preview").src = newsData.thumbnail;
        document.getElementById("n-thumb-link").value = newsData.thumbnail;
        document.getElementById("issue-link").value = newsData.link;
        document.getElementById("n-submit-btn").disabled = false;
        document.getElementById("is-n-featured").checked = isFeatured;

    } else {
        document.getElementById("id-input-n").value = uuidv4();
        document.getElementById("issue-number").value = '';
        document.getElementById("issue-volume").value = '';
        document.getElementById("issue-month").value = "January";
        document.getElementById("issue-year").value = '';
        document.getElementById("issue-head").value = "ABHIVAHYA";
        document.getElementById("issue-title").value ='';
        document.getElementById("n-img-preview").src = '';
        document.getElementById("n-thumb-link").value = '';
        document.getElementById("issue-link").value = '';
        document.getElementById("n-submit-btn").disabled = true;
        document.getElementById("is-n-featured").checked = true;
    }
}
function validateN() {
    var newsID = document.getElementById("id-input-n").value;
    var issue = document.getElementById("issue-number").value;
    var volume = document.getElementById("issue-volume").value;
    var month = document.getElementById("issue-month").value;
    var year = document.getElementById("issue-year").value;
    var heading = document.getElementById("issue-head").value;
    var title = markdown(document.getElementById("issue-title").value).replace(/(<([^>]+)>)/gi,'');
    var thumbnail = document.getElementById("n-thumb-link").value || `https://via.placeholder.com/480x270?text=${heading}+Issue+${issue}+Volume+${volume}+${month}+${year}`;
    var link = document.getElementById("issue-link").value || `https://via.placeholder.com/480x270?text=${heading}+Issue+${issue}+Volume+${volume}+${month}+${year}`;
    var setFeatured = document.getElementById("is-n-featured").checked;

    return {newsID,issue,volume,month,year,heading,title,thumbnail,link,setFeatured}
}
function setNewsResponse(res) {
    var id = res.newsID;

    var structuredNews = {
        "id" : id,
        "month" : res.month,
        "year" : res.year,
        "volume" : res.volume,
        "issue" : res.issue,
        "heading" : res.heading,
        "title" : res.title,
        "link" : res.link,
        "thumbnail" : res.thumbnail
    }

    var allNewsIndex = allNews.findIndex(item => item.id === id);
    if (allNewsIndex != -1) {
        allNews[allNewsIndex] = structuredNews;
    } else {
        allNews.push(structuredNews);
    }

    var i = (featuredNews.length > 0) ? featuredNews.findIndex(item => item.id === id) : -1;
    if (i != -1) {
        (res.setFeatured) ? featuredNews[i] = structuredNews : featuredNews.splice(i,1);
    } else {
        if (res.setFeatured) featuredNews.push(structuredNews);
    }

    newsRes = {
        "status": "OK",
        "data": {
            "featured": {
                "count": featuredNews.length,
                "data": featuredNews
            },
            "all-news": {
                "count": allNews.length,
                "data": allNews,
                "perPage": 100,
                "hasNext": false
            }
        }
    }

    backToAllNews();
    markDirty(true);
}
function confirmdeleteNews(id) {
    const mymodal = new mdb.Modal(document.getElementById('confirmDiag'));
    var confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.addEventListener('click', (eve) => {
        deleteNews(id);
        mymodal.hide();
    });
    mymodal.show();
}
function deleteNews(id) {
    var allNewsIndex = allNews.findIndex(item => item.id === id);
    if (allNewsIndex != -1) allNews.splice(allNewsIndex, 1);

    var featuredIndex = featuredNews.findIndex(item => item.id === id);
    if (featuredIndex != -1) featuredNews.splice(featuredIndex, 1);

    newsRes = {
        "status": "OK",
        "data": {
            "featured": {
                "count": featuredNews.length,
                "data": featuredNews
            },
            "all-news": {
                "count": allNews.length,
                "data": allNews,
                "perPage": 100,
                "hasNext": false
            }
        }
    }
    setupNewsTable(newsRes);

    mdb.Tab.getInstance(document.querySelector("#nav-link1")).show();
    mdb.Tab.getInstance(document.querySelector('#tab-news')).show();

    markDirty(true);
}

function hidecontent() {
    document.getElementsByClassName("log-content").forEach((el) => {
        el.classList.add('hide-item');
    });
    document.getElementsByClassName("log-form").forEach((el) => {
        el.classList.remove('hide-item');
    });
    document.getElementById('avatar').src = 'avatar-blank.png'
}
function showcontent() {
    document.getElementsByClassName("log-content").forEach((el) => {
        el.classList.remove('hide-item');
    });
    document.getElementsByClassName("log-form").forEach((el) => {
        el.classList.add('hide-item');
    });
    document.getElementById('avatar').src = 'avatar.png'
}
function signOut() {
    firebase.auth().signOut();
}
function forgetPass() {
    const mail = document.getElementById('loginmail').value;
    firebase.auth().sendPasswordResetEmail(mail)
        .then(() => {
      document.getElementById('loginerror').innerText = 'Reset Email sent to' + mail ;
  })
    .catch((error) => {
      document.getElementById('loginerror').innerText = error.message;
  });
}
function changePassModal() {
    const cModal = new mdb.Modal(document.getElementById('changePass'));
    var confirmBtn = document.getElementById('confirm-change-btn');
    var errordiv = document.getElementById('changepass-modal-err');
    confirmBtn.addEventListener('click', (eve) => {
        var cp1 = document.getElementById('cp1').value;
        var cp2 = document.getElementById('cp2').value;
        if (cp1 === cp2) {
            const user = firebase.auth().currentUser;
            user.updatePassword(cp1).then(() => {
                errordiv.innerText = '';
                cModal.hide();
            }).catch((error) => {
                errordiv.innerText = error.message;
            });
        } else {
            errordiv.innerText = 'Enter Same Valid Password on Both Fields';
        }
    });
    cModal.show();
}
