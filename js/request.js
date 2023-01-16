// for leader
const elForm = document.querySelector(".form");
const elList = document.querySelector(".list");
const indicatorEl = document.getElementById("indicatorEl");
const overlay = document.getElementById("overlay");
indicatorEl.innerHTML = "";

elForm.search.focus();

// toggle loader
const loaderToggle = (toggle) => {
    if (toggle) {
        overlay.classList.remove("hidden");
    } else {
        overlay.classList.add("hidden");
    }
};

// API
const KEY = 'Dj8CcziVA1UHhyjhD4qRz6v0zU_OgDCfVvIbbfuKCHM'
const api = `https://api.unsplash.com/photos/?client_id=${KEY}`

// request promise
const getDate = (resource) => {
    return new Promise((resove, reject) => {
        const request = new XMLHttpRequest();

        request.addEventListener('readystatechange', () => {
            if (request.readyState < 4) {
                loaderToggle(true)
            } else if (request.status == 200 && request.readyState == 4) {
                const date = (JSON.parse(request.responseText))
                console.log(date);
                resove(date);
                loaderToggle(false)
            } else if (reject.readyState == 4) {
                reject("Error!!!");
                loaderToggle(false);
            }
        })

        request.open('GET', resource)
        request.send()
    })
}

// load
getDate(api)
    .then((date) => {
        updateUL(date);
    })
    .catch((err) => { });

elForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputValue = elForm.search.value.trim()
    console.log(inputValue);

    const searchApi = `https://api.unsplash.com/search/photos?page=1&query=${inputValue}&client_id=${KEY}`;
    checker(inputValue, searchApi);
    elForm.reset()
})

function statusEl(color, indicator) {
    indicatorEl.innerHTML = indicator;
    indicatorEl.style.color = `${color}`;
}

function checker(text, api) {
    if (text) {
        getDate(api)
            .then((data) => {
                if (data.results && data.results.length == 0) {
                    statusEl("red", "Siz qidirgan nom ostida rasim mavjud emas");
                    list.innerHTML = "";
                } else {
                    updateUL(data);
                    statusEl("aqua", "Muvaffaqiyatli amalga oshirildi");
                }
            })
            .catch((err) => {
                statusEl("red", "xatolik yuz berdi");
                list.innerHTML = "";
                console.log(err);
            });
    } else {
        statusEl("red", "plece enter text");
    }
}


function updateUL(data) {
    elList.innerHTML = "";
    (data.results ? data.results : data).forEach((item) => {
        const { likes, urls, links, user } = item;

        elList.innerHTML += `<li  class="item">
        <a href = "${links.html}"><img class="img" src="${urls.regular
            }" alt="" /></a>
        <div class="info">
            <div class="info-ext">
                <p class="itemTitle">${user.name}</p>
                <p class="likes">${likes} likes</p>
            </div>
            <a class="imgLink" href="${user.links.html}">
                <img
                    class="author-img"
                    src="${user ? user.profile_image.medium : "./nobody.png"}"
                    alt=""
                    width="15"
                    height="15" />
            </a>
        </div>
    </li>`;
    });
}