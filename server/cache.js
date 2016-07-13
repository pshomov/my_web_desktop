module.exports = function createCache(maxItems) {
    var items = [];
    return {
        addItem : function addItem(item) {
            items.push(item);
            items = items.slice(-maxItems);
        },
        getItems : function getItems() {
            return items;
        }
    }
}