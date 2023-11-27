// const args = require("minimist")(process.argv.slice(2));

const minimist = require("minimist");

// console.log(args);

let args = minimist(process.argv.slice(2));
console.log(args.name);

// const fs = require('fs');
// const http = require('http');

// const readline = require('readline');

// const lineDetail = readline.createInterface({ input: process.stdin, output: process.stdout });

// lineDetail.question('Please provie your name - ', (name) => {
//     console.log(`Hi ${name}`);
//     lineDetail.close();
// })


// const server = http.createServer((req, res) => {
//     const stream = fs.createReadStream("sample.txt");
//     stream.pipe(res);
// fs.readFile("sample.txt", (err, data) => {
//     if (err)
//         throw err;
//     res.end(data);
// })
// });
// server.listen(3333);

// fs.writeFile("sample.txt", "Welcome to Node JS FS", (err) => {
//     if (err)
//         throw err;
//     console.log("File created");
// });

// fs.readFile("sample.txt", (err, data) => {
//     if (err)
//         throw err;
//     console.log(data.toString());
// })

// fs.appendFile("sample.txt", "this is iupdated txt", (err) => {
//     if (err)
//         throw err;
//     console.log('appended');
// })

// fs.rename("sample.txt", "test.tst", (err) => {
//     if (err)
//         throw err;
//     console.log("updated name");
// })

// fs.unlink("test.tst", (err) => {
//     if (err)
//         throw err;
//     console.log("test.txt fil;e is deleted");
// })