module.exports.productNewPrice = (products) => {
    const newPrice = products.map((item) => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
    })
    return products;
}

module.exports.detailProductNewPrice = (product) => {

    product.newPrice = (product.price - product.price * product.discountPercentage / 100).toFixed(0);

    return product;
}