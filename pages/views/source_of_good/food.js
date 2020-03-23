var food_data = [
  '不限', '书籍', '服装', '道具', '文具', '电子产品', '家具', '交通工具', '其他',
]
  ;
var rentName = [
  '不限', '闲置出租', '二手出售', '免费赠送'
]
  ;
function getFoodList() {
  return food_data;
}
function getRentName() {
  return rentName;
}
module.exports = {
  getFoodList: getFoodList,
  getRentName: getRentName
}