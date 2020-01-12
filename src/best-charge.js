function bestCharge(items) {
    let sumOfOriginalPrice = GetSumOfPrice(items, "original");
    let sumOfEnjoyHaltPrice = GetSumOfPrice(items, "halt");
    let sumOfFullReduce = -1;
    if (sumOfOriginalPrice >= 30) {
        sumOfFullReduce = sumOfOriginalPrice - 6;
    }

    return bestResultOfCompare(sumOfOriginalPrice, sumOfEnjoyHaltPrice, sumOfFullReduce, items);
}

function GetSumOfPrice(items, flag) {
    let sum = 0;
    if (flag === "halt") {
        sum = items.reduce((sum, item) => {
            if (item.halt === "true") {
                sum += item.number * (item.price / 2);
            }
            if (item.halt === "false") {
                sum += item.number * item.price;
            }
            return sum;
        }, 0)
    }

    if (flag === "original") {
        sum = items.reduce((sum, item) => {
            sum += item.number * item.price;
            return sum;
        }, 0)
    }
    return sum;
}

function bestResultOfCompare(original, halt, fullThirty, items) {
    let result = '';
    if (fullThirty > 0) {
        if (fullThirty <= halt) {
            result = getPrintInfo(fullThirty, items, "fullReduce");
        }

        if (fullThirty > halt) {
            result = getPrintInfo(halt, items, "halt", original);
        }
    }

    if (fullThirty < 0) {
        if (halt === original) {
            result = getPrintInfo(original, items, "original");
        } else {
            result = getPrintInfo(halt, items, "halt", original);
        }
    }
    return result;
}

function getPrintInfo(total, items, flag, original) {
    let result = '';
    let SelectItem = getSelectItems(items);
    if (flag === "original") {
        result = `============= 订餐明细 =============\n` +
            SelectItem[0] +
            '\n-----------------------------------\n' +
            '总计：' + total + '元\n' +
            `===================================`
    }

    if (flag === "halt") {
        result = `============= 订餐明细 =============\n` +
            SelectItem[0] +
            '\n-----------------------------------\n' +
            '使用优惠:\n' +
            '指定菜品半价(' + SelectItem[1].join() + ')，省' + (original - total) + '元\n' +
            '-----------------------------------\n' +
            '总计：' + total + '元\n' +
            `===================================`
    }

    if (flag === "fullReduce") {
        result = `============= 订餐明细 =============\n` +
            SelectItem[0] +
            '\n-----------------------------------\n' +
            '使用优惠:\n' +
            '满30减6元，省6元\n' +
            '-----------------------------------\n' +
            '总计：' + total + '元\n' +
            `===================================`
    }
    return result;
}

function getSelectItems(items) {
    let arr = items.reduce((arr, item) => {
        if (item.number > 0) {
            if (item.halt === "true") {
                arr[1].push(item.name);
            }
            arr[0] += item.name + ' x ' + item.number + ' = ' + item.number * item.price + "元\n";
        }
        return arr;
    }, ['', []])
    arr[0] = arr[0].substring(0, arr[0].length - 1);
    return arr;
}
2