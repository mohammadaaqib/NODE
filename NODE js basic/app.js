const realine = require("readline");
const fs = require("fs");
const http = require("http");
const url = require("url");

/*LECTURE 4: CODE EXAMPLE************
READING INPUT & WRITING OUTPUT
*************************************
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Please enter your naame: ", (name) => {
    console.log("You entered: "+name);
    rl.close();
})

rl.on('close', () => {
    console.log("Interface closed");
    process.exit(0);
})*/

/*LECTURE 5: CODE EXAMPLE************
READING & WRITING TO A FILE
*************************************
let textIn = fs.readFileSync('./Files/input.txt', 'utf-8'); //10min
console.log(textIn)

let content = `Data read from input.txt: ${textIn}. \nDate created ${new Date()}`
fs.writeFileSync('./Files/output.txt', content);*/

/*LECTURE 7: CODE EXAMPLE**************
READING & WRITING TO FILE ASYNCHRONOUSLY
***************************************
fs.readFile('./Files/start.txt', 'utf-8', (error1, data1) => {
    console.log(data1)
    fs.readFile(`./Files/${data1}.txt`, 'utf-8', (error2, data2) => {
        console.log(data2);
        fs.readFile('./Files/append.txt', 'utf-8', (error3, data3) => {
            console.log(data3);
            fs.writeFile('./Files/output.txt', `${data2}\n\n${data3}\n\nDate created ${new Date()}`, () => {
                console.log('File writen successfully');
            });
        })
    })
})


console.log('Reading file....');*/
const html = fs.readFileSync("./Template/index.html", "utf-8");
let productListHtml = fs.readFileSync("./Template/product-list.html", "utf-8");
let productDetailHtml = fs.readFileSync(
  "./Template/product-details.html",
  "utf-8"
);
let product = JSON.parse(fs.readFileSync("./Data/product.json", "utf-8"));

function replaceHtml(template, product) {
  let output = template.replace("{{%IMAGE%}}", product.productImage);
  output = output.replace("{{%NAME%}}", product.name);
  output = output.replace("{{%MODELNAME%}}", product.modeName);
  output = output.replace("{{%MODELNO%}}", product.modelNumber);
  output = output.replace("{{%SIZE%}}", product.size);
  output = output.replace("{{%CAMERA%}}", product.camera);
  output = output.replace("{{%PRICE%}}", product.price);
  output = output.replace("{{%COLOR%}}", product.color);
  output = output.replace("{{%ID%}}", product.id);
  output = output.replace("{{%ROM%}}", product.ROM);
  output = output.replace("{{%DESC%}}", product.Description);

  return output;
}

const server = http.createServer((request, response) => {
  let { query, pathname: path } = url.parse(request.url, true);
  //   let path = request.url;
  if (path == "/" || path.toLocaleLowerCase() == "/home") {
    response.writeHead(200, {
      "Content-type": "text/html",
      myHeader: "hello, word",
    });
    response.end(html.replace("{{%CONTENT%}}", "You are in Home Page"));
  } else if (path.toLocaleLowerCase() == "/about") {
    response.writeHead(200, {
      "Content-type": "text/html",
      myHeader: "hello, word",
    });
    response.end(html.replace("{{%CONTENT%}}", "You are in About Page"));
  } else if (path.toLocaleLowerCase() == "/contact") {
    response.writeHead(200, {
      "Content-type": "text/html",
      myHeader: "hello, word",
    });
    response.end(html.replace("{{%CONTENT%}}", "You are in Contact Page"));
  } else if (path.toLocaleLowerCase() == "/products") {
    response.writeHead(200, {
      "Content-type": "text/html",
    });
    if (!query.id) {
      let productHtmlArray = product.map((prod) => {
        return replaceHtml(productListHtml, prod);
      });
      let productresponse = html.replace(
        "{{%CONTENT%}}",
        productHtmlArray.join(",")
      );
      response.end(productresponse);
    } else {
      let prodDetailHtml = replaceHtml(productDetailHtml, product[query.id]);

      response.end(html.replace("{{%CONTENT%}}", prodDetailHtml));
    }
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
      myHeader: "hello, word",
    });
    response.end(html.replace("{{%CONTENT%}}", "Error 404: Page not found"));
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is started");
});
