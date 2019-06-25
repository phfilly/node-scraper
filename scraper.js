const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://news.ycombinator.com/';
let LINEDATA = [];
let data = [];
let labels = [];

async function getEveTechProduct(productURL) {
    return rp(`https://www.evetech.co.za/${productURL}`)
    .then(function(html) {
        const product = {
            vendor: 'evetech',
            price: 0,
            oldPrice: 0,
            isSpecial: false,
            name: '',
            description: ''
        };
        product.name = $('#tab1 h1', html).html();
        product.price = $('.bigprice span', html).html().trim();
        product.price = product.price.substring(1, product.price.length);
        product.description = $('#detail-middle h2', html).html();

        // const descriptionList = $('.short-description .std p', html)[0];
        // for (let i = 0; i < descriptionList.children.length; i++) {
        //     if (descriptionList.children[i].data) {
        //         product.description += `${descriptionList.children[i].data}\n`;
        //     }
        // }
        // console.log(product);
        return [product];
    }).catch(function(err) {
        console.log('err', err);
    });
}

async function getIncredibleConnectionProduct(productURL) {
    return rp(`https://www.incredible.co.za/${productURL}`)
    .then(function(html) {
        const product = {
            vendor: 'incredible-connection',
            price: 0,
            oldPrice: 0,
            isSpecial: false,
            name: '',
            description: ''
        };
        product.name = $('.product-top .product-name', html)[0].children[1].children[0].data;
        product.oldPrice = $('.old-price .price', html)[0].children[0].data.trim();
        product.price = $('.special-price .price', html)[0].children[0].data.trim();
        // product.price = $('.regular-price .price', html)[0].children[0].data.trim();
        product.price = product.price.substring(1, product.price.length);

        const descriptionList = $('.short-description .std p', html)[0];
        for (let i = 0; i < descriptionList.children.length; i++) {
            if (descriptionList.children[i].data) {
                product.description += `${descriptionList.children[i].data}\n`;
            }
        }
        // console.log(product);
        return product;
    }).catch(function(err) {
        console.log('err', err);
    });
}

async function getFNBLaptops() {
    return rp(`https://www.fnb.co.za/Controller?nav=electronics.catalogue.nav.DeviceProduct&categoryCode=LAPTO&brandCode=all_brands&sortOrder=DESC&_=1553798929038`)
    .then(function(html) {
        const list = [];
        for (let i = 0; i < $('h3[data-copy]', html).length; i++) {
            const product = {
                vendor: 'fnb',
                price: 0,
                oldPrice: 0,
                isSpecial: false,
                name: '',
                image: '',
                description: '',
                date: Date.now()
            };
            product.name = $('h3[data-copy]', html)[i].children[0].data.replace(/\s+/g, ' ').trim();
            product.price = $('.shop_product_desc2 strong', html)[i].children[0].data.replace(/\s+/g, ' ').trim();
            product.price = product.price.substring(1, product.price.length);
            product.description = $('.shop_product_desc1', html)[i].children[0].data.replace(/\s+/g, ' ').trim();
            product.image = `https://www.fnb.co.za${$('.hAlignCenter img', html)[i].attribs.src}`;
            list.push(product);
        }
        return list;
    }).catch(function(err) {
        console.log('err', err);
    });
}

async function getIncredibleConnectionProducts(priceRange) {
    return rp(`https://www.incredible.co.za/departments/computers-notebooks-tablets/notebooks/gaming?price=${priceRange}`)
    .then(function(html) {
        const list = [];
        for (let i = 0; i < ($('#products-grid', html)[0].children.length / 2) - 1; i++) {
            const product = {
                vendor: 'incredible-connection',
                price: 0,
                oldPrice: 0,
                isSpecial: false,
                name: '',
                image: '',
                description: '',
                date: Date.now()
            };
            product.name = $('.product-name', html)[i].children[1].children[0].data.trim();
            try {
                product.oldPrice = $('.old-price .price', html)[i].children[0].data.trim();
                product.price = $('.special-price .price', html)[i].children[0].data.trim();
                product.isSpecial = true;
            } catch (e) {
                product.price = $('.price', html)[i].children[0].data.trim();
            }
            product.image = $('.low-priority-lazyload', html)[i].attribs['data-src'];
            product.price = product.price.substring(1, product.price.length);
            list.push(product);
        }
        return list;
    }).catch(function(err) {
        console.log('err', err);
    });
}

async function getWootWareProducts(priceRange) {
    return rp(`https://www.wootware.co.za/pcs-and-laptops/laptops-notebooks/laptops-notebooks?${priceRange}`)
    .then((html) => {
        const list = [];
        for (let i = 0; i < $('.category-products', html)[0].children.length; i++) {
            const product = {
                vendor: 'wootware',
                price: 0,
                oldPrice: 0,
                isSpecial: false,
                name: '',
                image: '',
                description: '',
                link: '',
                date: Date.now()
            };

            try {
                product.name = $('.product-name a', html)[i].attribs.title;
                product.link = $('.prolabel-wrapper a', html)[i].attribs['href'];
                product.image = $('.prolabel-wrapper a img', html)[i].attribs['data-src'];
                product.price = $('.price', html)[i].children[0].data;
                product.price = product.price.substring(1, product.price.length);
                list.push(product);
            } catch (e) {
                console.log('product not found');
            }
        }
        return list;
    }).catch(function(err) {
        console.log('err', err);
    });
}


module.exports = {
  getIncredibleConnectionProduct,
  getIncredibleConnectionProducts,
  getEveTechProduct,
  getFNBLaptops,
  getWootWareProducts
};
  


// var options = {
//     uri: 'https://api.takealot.com/rest/v-1-8-0/productlines/search?sort=Default%20Descending&rows=20&start=0&detail=mlisting&qsearch=dell%20g5%2015%20special%20edition%20gaming%20laptop&_si=ec427224a332578879265fc7f9af63bf&filter=Available:true',
//     headers: {
//         'accept': 'application/json, text/javascript, */*; q=0.01'
//     },
//     json: true
// };

// rp(options)
//     .then((response) => console.log(response['results']['productlines'][0]['title']))
//     .catch((err) => console.log('err', err));

// ("", 
// {"credentials":"omit",
//     "headers":{"accept":"application/json, text/javascript, */*; q=0.01"},
//     "referrer":"https://www.takealot.com/all?qsearch=dell+g5+15+special+edition+gaming+laptop&via=suggestions&_si=ec427224a332578879265fc7f9af63bf",
//     "referrerPolicy":"no-referrer-when-downgrade",
//     "body":null,
//     "method":"GET",
//     "mode":"cors"
// }).then((response) => console.log(response));


// const puppeteer = require('puppeteer');

// async function launch() {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto('https://books.toscrape.com');

//   await browser.close();
// }

// launch();