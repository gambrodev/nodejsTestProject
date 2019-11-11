// node core module for filesystem operations
const fs = require('fs');
// node module for http operations
const http = require('http');
// node module for URLs
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'UTF-8');
const laptopData = JSON.parse(json);

// the callback is runned everytime someone access 
// a pege on the server
const server = http.createServer((req, res) => {

    /**
     * ROUTING (just a sample. IRL use Express)
     */
    // parse url into an object 
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const id = parsedUrl.query.id;
    
    // OVERVIEW ROUTE
    if (pathName === '/products' || pathName === '') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/templates/template_overview.html`, 'UTF-8', (err, overviewHtml) => {

            fs.readFile(`${__dirname}/templates/template_card.html`, 'UTF-8', (err, cardHtml) => {
                const cards = laptopData.map(laptop => replaceTemplate(cardHtml, laptop));
                const output = overviewHtml.replace(/{%CARDS%}/g, cards.join(''));
                res.end(output);
            });
        });
    }
    // SINGLE LAPTOP ROUTE
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/templates/template_laptop.html`, 'UTF-8', (err, data) => {
            const laptop = laptopData[id];
            let output = replaceTemplate(data, laptop);
            res.end(output);
        });

    }
    // IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpeg' });
            res.end(data);
        });
    }
    else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('resource not found on the server');
    }


});

// port and ip
server.listen(1337, '127.0.0.1');

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%ID%}/g, laptop.id);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    return output;
}