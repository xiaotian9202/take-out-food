let items_list = document.querySelector(".items-list");
let promotions_list = document.querySelector("#promotions");
let message = document.querySelector("#message");
let data = loadAllItems();
data = initData(data);
updateItemList(data);
updatePromotionsList(data);

items_list.addEventListener('mouseup', function(event) {
    if (event.target.innerHTML === "+" || event.target.innerHTML === "-") {
        let tr = event.target.parentNode.parentNode;
        let id = tr.firstElementChild.innerHTML;
        let span = tr.querySelector("span");
        span.innerHTML = event.target.innerHTML === "+" ? parseInt(span.innerHTML) + 1 : parseInt(span.innerHTML) - 1;

        for (let item of data) {
            if (item.id === id) {
                item.number = parseInt(span.innerHTML);
            }
        }
    }
})

function updateItemList(data) {
    items_list.innerHTML = "";
    items_list.innerHTML += data.reduce((html, item) => {
        return html += "<tr><td>" + item.id + "</td>" +
            "<td>" + item.name + "</td>" +
            "<td>" + item.price + "元</td>" +
            "<td><button>-</button>" +
            "<span>" + item.number + "</span>" +
            "<button>+</button></td>" +
            "</tr > ";
    }, '')
}

function updatePromotionsList(data) {
    let str = "<h4>优惠一</h4><p>满30减6元</p><h4>优惠二</h4><p>指定商品半价:</p>";
    promotions_list.innerHTML += data.reduce((str, item) => {
        if (item.halt === "true") {
            str += "<p>" + item.name + "</p>";
        }
        return str;
    }, str)
}

function initData(data) {
    let promotions = loadPromotions();
    let itemsOfHaltPrice = promotions.filter((item) => item.type === "指定菜品半价");
    data.map((item) => {
        item.halt = itemsOfHaltPrice[0].items.find(temp => temp === item.id) ? 'true' : 'false';
        item.number in item ? item.number : item.number = 0;
    })
    return data;
}

function calculatePrice() {
    message.innerHTML = bestCharge(data);
}

function clearHistory() {
    data.map((item) => item.number = 0);
    updateItemList(data);
    message.innerHTML = "";
}