document.querySelector('#loading').setAttribute("class", "loading__full");

var xhr = new XMLHttpRequest();
// xhr.open('get','https://cors-anywhere.herokuapp.com/https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx',true);
xhr.open('get', 'food.json', true);
xhr.send();

var storeData, cityFilter, townFilter, inputData

xhr.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
        storeData = JSON.parse(this.responseText);
        inputData = storeData
        pagination(storeData, 1);

        console.log('資料載入成功');
        /*載入縣市資料 */
        let city = [];
        for (i = 0; i < storeData.length; i++) {
            city.push(storeData[i].City);
        }
        cityFilter = city.filter(function (element, index, arr) {
            return city.indexOf(element) === index;
        })
        for (i = 0; i < cityFilter.length; i++) {
            let citySelect = document.querySelector('#city');
            let cityOption = document.createElement("option");
            cityOption.text = cityFilter[i];
            cityOption.setAttribute("value", cityFilter[i]);
            citySelect.add(cityOption);
        }
        document.getElementById("loading").remove();
    } else {
        console.log('資料載入錯誤');
    }
}
// 切換縣市
function changeCity() {
    let town = [];
    let cityJson = []
    let printTown = ""
    let citySelect = document.querySelector("#city");
    let townSelect = document.querySelector("#town");
    let selected = citySelect.options[citySelect.selectedIndex].value;
    printContent = " ";
    printTableContent = " ";
    for (i = 1; i < storeData.length; i++) {
        if (storeData[i].City === selected) {
            town.push(storeData[i].Town);
            cityJson.push(storeData[i]);
            inputData = cityJson;
            townFilter = town.filter(function (element, index, arr) {
                return town.indexOf(element) === index;
            });
        }
    }
    for (i = 0; i < townFilter.length; i++) {
        printTown += `<option value="${townFilter[i]}">${townFilter[i]}</option>`;
    }
    townSelect.innerHTML = '<option selected disabled>請選擇鄉鎮別</option>' + printTown;
    pagination(cityJson, 1);
}
//切換鄉鎮
function changeTown() {
    printContent = " ";
    printTableContent = " ";
    let townJson = [];
    let townSelect = document.querySelector("#town");
    let selected = townSelect.options[townSelect.selectedIndex].value;
    for (i = 0; i < storeData.length; i++) {
        if (storeData[i].Town == selected) {
            townJson.push(storeData[i]);
            inputData = townJson;
        }

    }
    pagination(townJson, 1);
}
//廣告固定
let ad = document.querySelector('#ad__position');
let adPosition = ad.offsetTop;
function scrollHandler() {
    if ((window.innerWidth > 414) && (window.scrollY >= adPosition)) {
        ad.classList.add('js-ad__fixed');
    } else {
        ad.classList.remove('js-ad__fixed');
    }
}
document.addEventListener('scroll', scrollHandler);

//切換版面
let card = document.querySelector('#card');
let table = document.querySelector('#table');
let listIcon = document.querySelector('#icon__list');
let listCard = document.querySelector('#icon__card');
let listTable = document.querySelector('#icon__table');

function clickList() {
    table.classList.add('js-table-noshow')
    card.style.display = "";
    listIcon.style.color='black';
    listCard.style.color='';
    listTable.style.color='';
    document.querySelector('#card').setAttribute('class', 'card card-list');
}
function clickCard() {
    table.classList.add('js-table-noshow')
    document.querySelector('#icon__list').style.color='';
    card.style.display = ""
    listIcon.style.color='';
    listCard.style.color='black';
    listTable.style.color='';
    document.querySelector('#card').setAttribute('class', 'card card-card');
}
function clickTable() {
    table.classList.remove('js-table-noshow')
    card.style.display = "none"
    listIcon.style.color='';
    listCard.style.color='';
    listTable.style.color='black';
}

//分頁效果
let pageShow = document.querySelector('#pagetotal');
let pageButton = document.querySelector('#pagebutton')

function pagination(jsonData, nowpage) {
    // console.log(jsonData.length)
    const total = jsonData.length;
    const perPage = 10;
    const pageTotal = Math.ceil(total / perPage);
    // console.log(`全部 ${total}筆資料 每頁顯示${perPage}筆 總共${pageTotal}頁`)

    let currentPage = nowpage;
    if (currentPage > pageTotal) {
        currentPage = pagetotal;
    }
    const minData = (currentPage * perPage) - perPage + 1;
    const maxData = currentPage * perPage;
    const data = [];
    jsonData.forEach((item, index) => {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
            data.push(item);
        }
    })

    pageShow.innerHTML = `美食頁次:${currentPage}/${pageTotal}`

    const page = {
        pageTotal,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < total,
    }
    pageBtn(page);
    displayData(data, currentPage, perPage);
}

function displayData(data, currentPage, perPage) {
    let printContent = '';
    let printContentUrl = '';
    let printTableContent = '';
    let printTableContentUrl = '';
    data.forEach((item, index) => {
        if (item.Url) {
            printContentUrl = `
            <div class="content__text__title">
                <a href="${item.Url}" target="_blank">${item.Name}</a>    
            </div>
            `
            printTableContentUrl = `
            <a href="${item.Url}" target="_blank">${item.Name}</a> 
            `;
        } else {
            printContentUrl = `
            <div class="content__text__title">${item.Name}</div>
            `
            printTableContentUrl = `${item.Name}`;
        }

        printContent += `
        <li class="card__content">
            <div class="content__img">
                <img class="content__img__show "src="${item.PicURL}" alt="">
                <div class="content__img__dark"></div>
            </div>
            <div class="content__location">
                <div class="content__location_city">${item.City}</div>
                <div class="content__location_town">${item.Town}</div>
            </div>
            <div class="content__text">
                ${printContentUrl}
                <p class="content__text__feature">${item.HostWords}
                </p>
            </div>
        </li>
        `

        let printTableHead =
            `
        <tr>
            <th>編號</th>
            <th>行政區</th>
            <th>鄉鎮區</th>
            <th>商家</th>
            <th>地址</th>
        </tr>
        `

        printTableContent +=
            `
        <tr>
            <td>${(currentPage * perPage) - 10 + (index + 1)}</td>
            <td>${item.City}</td>
            <td>${item.Town}</td>
            <td>${printTableContentUrl}</td>
            <td title="${item.Address}">${item.Address}</td>
        </tr>
         `;
        document.querySelector("#tablecontent").innerHTML = printTableHead + printTableContent;
    })
    document.querySelector("#card").innerHTML = printContent;

}

function pageBtn(page) {
    let str = '';
    const total = page.pageTotal;
    for (let i = 1; i <= total; i++) {
        str += `<li class="pagination__per"><a href="#" data-page=${i}>${i}</a></li>`;
        // str += `<button data-page=${i}>${i}</button>`;
    };
    pageButton.innerHTML = str;
}

function switchPage(e) {
    // e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    pagination(inputData, page);
}

pageButton.addEventListener('click', switchPage)


