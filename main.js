/**
 * @author Cioromela Valentin Stefan
 */


// Import Apify SDK. For more information, see https://sdk.apify.com/
const Apify = require('apify');


Apify.main(async () => {

    // Array  for products
    let output = [];

    // Geting input of the actor.
    const input = await Apify.getInput();

    //   Getting the links that need to be scraped 
    const requestList = await Apify.openRequestList('start-urls', input);


    // Getting data from the page and organize it in an object,  object that is put in an array
    const handlePageFunction = async ({ request, $ }) => {

        // Making the object with the product detailes scraped from the page
        const product = {
            ProductName: $('.page-title')      
                            .text()
                            .trim(),

            ProductUrl: request.url,

            Price: $('p.product-new-price')
                        .first()
                        .text()
                        .trim()
                        .replace(/[\.\sLei]/g, ``)     // from a string like this "1.200.300.327.28899 Lei"  it will eliminate the "." and " Lei",  resulting "120030032728899"
                        .replace(/\d\d$/g, `.$&`),     // to a string line "120030032728899"   will put the dot before the last two digits,      resulting "1200300327288.99"
            
            Stock: stock =   ($('.label-in_stock').text()) ? "InStock"
                            : ($('.label-limited_stock_qty').text()) ? "InStock"
                            : ($('.label-out_of_stock').text()) ? "OutOfStock"
                            : undefined
        };

        // Adding the object to an array that contains all the scraped products
        output.push(product);

    };


    // Set up the crawler, passing a single options object as an argument.
    const crawler = new Apify.CheerioCrawler({
        requestList,
        handlePageFunction,
    });

    // Starting the CheerioCrawler
    await crawler.run();

    // Saving all the products in the OUTPUT file
    await Apify.setValue('OUTPUT', output);

    // Displaying in terminal the OUTPUT file
    //console.dir(output);

});










////////    Code that I replaced / deleted    ////////


// // Getting the product page url
// const url = request.url;

// // Getting the product name
// const name = $('.page-title').text().trim();

// // Getting product price
// const price = $('p.product-new-price').first().text();

// // Clearing the price string
// // (first try) priceCleard = price.trim().replace(/\s\w+/g, ``).replace(/\./g, ``).replace(/\d\d$/g, `.$&`);
// const priceCleard = price.trim().replace(/[\.\sLei]/g, ``).replace(/\d\d$/g, `.$&`);



// //  Getting the links that need to be scraped   (first try) 
// const requestQueue = await Apify.openRequestQueue();
// input.forEach(element => {
//     // console.log(element);
//     //await 
//     requestQueue.addRequest(element);
// });
// //  => The problem was that await it was dificult to make it work and didn't need to be that complicated
// //     I discovered "requestList" who made more sense to use



// Getting the product stock situation
// let stock;
// if ($('.label-in_stock').text()) {
//     stock = "InStock";

// } else {
//     // The page can display in the event of low stock the number of products
//     //      $('.label-limited_stock_qty').text();
//     // Saving the string "InStock" instead of the number of products
//     if ($('.label-limited_stock_qty').text()) {
//         stock = "InStock";

//     } else if ($('.label-out_of_stock').text()) {  // at this point is safe to say its out of stok and the condition is not necesary.  But just to be sure
//         stock = "OutOfStock";
//     }

// }


