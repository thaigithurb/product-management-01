module.exports.productNewPrice = (products) => {
    const newPrice = products.map((item) => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(2);
    })
    return products;
}