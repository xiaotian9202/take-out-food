function bestCharge(selectedItems) {
  console.assert(selectedItems.length, "Don't have any items!");
  let promotions = loadPromotions();
  let items = loadAllItems();
  let infoOfSelectedItems = getInfoOfSelectedItems(selectedItems, promotions, items);

  let sumOfOriginalPrice = GetSumOfPrice(infoOfSelectedItems, false);
  let sumOfFullReduce = -1;
  if (sumOfOriginalPrice >= 30) {
    sumOfFullReduce = sumOfOriginalPrice - 6;
  }
  let sumOfEnjoyHaltPrice = GetSumOfPrice(infoOfSelectedItems, items,true);
  return bestResultOfCompare(sumOfOriginalPrice, sumOfEnjoyHaltPrice, sumOfFullReduce, infoOfSelectedItems);
}

function GetSumOfPrice(items, bool) {
  let sum = 0;
  if (!bool) {
    for (let i = 0, lens = items.length; i < lens; i++) {
      sum += parseInt(items[i].count) * items[i].price;
    }
  } else {
    for (let i = 0, lens = items.length; i < lens; i++) {
      if (items[i].haltPrice) {
        sum += parseInt(items[i].count) * items[i].haltPrice;
      } else {
        sum += parseInt(items[i].count) * items[i].price;
      }
    }
  }
  return sum;
}


function getInfoOfSelectedItems(selectedItems, promotions, items) {
  let setOfSelectedItems = [];
  for (let i = 0, lens = selectedItems.length; i < lens; i++) {
    let item = selectedItems[i].split(' x ');
    for (let j = 0, itemsLens = items.length; j < itemsLens; j++) {
      if (items[j].id === item[0]) {
        let infoOfItem = items[j];
        if (isHaltPrice(item[0], promotions)) {
          infoOfItem.haltPrice = infoOfItem.price * 0.5;
        }
        infoOfItem.count = item[1];
        setOfSelectedItems.push(infoOfItem);
      }
    }
  }
  return setOfSelectedItems;
}

function isHaltPrice(id, promotions) {
  for (let i = 0, lens = promotions.length; i < lens; i++) {
    if (promotions[i].type === '指定菜品半价') {
      for (let j = 0, proItemsLens = promotions[i].items.length; j < proItemsLens; j++) {
        if (promotions[i].items[j] === id) {
          return true;
        }
      }
    }
  }
  return false;
}

function bestResultOfCompare(original, halt, fullThirty, items) {
  let result = '';
  let infoOfPrint = arrToStr(items);
  if (original === halt) {
    if (fullThirty > 0) {
      result = `
      ============= 订餐明细 =============\n`
      + infoOfPrint.orderDetail
      + '-----------------------------------\n'
      + '使用优惠:\n'
      + '满30减6元，省6元\n'
      + '-----------------------------------\n'
      + '总计：' + fullThirty + '元\n'
      + `===================================`
    } else {
      result = `
      ============= 订餐明细 =============\n`
      + infoOfPrint.orderDetail
      + '-----------------------------------\n'
      + '总计：' + original + '元\n'
      + `===================================`
    }
  } else {
    if (fullThirty > 0 && fullThirty < halt) {
      result = 
      `============= 订餐明细 =============\n`
      + infoOfPrint.orderDetail
      + `-----------------------------------\n`
      + '使用优惠:\n'
      + '满30减6元，省6元\n'
      + '-----------------------------------\n'
      + '总计：' + fullThirty + '元\n'
      + `===================================`
    } else {
      result = 
      `============= 订餐明细 =============\n`
      + infoOfPrint.orderDetail
      + '-----------------------------------\n'
      + '使用优惠:\n'
      + '指定菜品半价(' + infoOfPrint.itemOfHalt + ')，省' + (original - halt) + '元\n'
      + '-----------------------------------\n'
      + '总计：' + halt + '元\n'
      + `===================================`
    }
  }
  return result;
}

function arrToStr(items) {
  let obj = {

  };
  let str = '';
  let haltItem = '';
  for (let i = 0, lens = items.length; i < lens; i++) {
    if (items[i].haltPrice) {
      haltItem += items[i].name + '，';
    }
    str += items[i].name + ' x ' + items[i].count + ' = ' + (parseInt(items[i].count) * items[i].price) + '元\n';
  }
  obj.orderDetail = str;
  if (haltItem !== '') {
    obj.itemOfHalt = haltItem.substr(0, haltItem.length-1);
  }
  return obj;
}