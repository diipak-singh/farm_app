const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//Synchronous way, i.e blocking
// const textIn = fs.readFileSync('file.txt','utf-8');
// console.log(textIn);
// const txtOut = 'Hello this is from another location';
// fs.writeFileSync('file.txt',txtOut);
// console.log("FIle written successfully");

//now doing the same thing in non-blocking i.e asynchronous way
// fs.readFile('file.txt', 'utf-8', (err, data) =>{
// console.log(data);
// })
// console.log('Reading file');//this will come top of the readed data becoz in async it doesn;t lock the other code.


//const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
// console.log(slugs);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)

    // Overview Page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
    }
    //Product Page
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    }
    //API
    else if(pathname ==='/api'){

        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    }
    //page not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1> Page not found.! </h1>')
    }


})

server.listen(4444,'127.0.0.1', () =>{
    console.log('Listening to requests on port 4444 ')
})
