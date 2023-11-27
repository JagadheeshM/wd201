const fs = require('fs');
const http = require('http');
const minimist = require('minimist');

let args = minimist(process.argv.slice(2));
let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, data) => {
    if (err) throw err;
    homeContent = data;
});

fs.readFile("project.html", (err, data) => {
    if (err) throw err;
    projectContent = data;
});

fs.readFile("registration.html", (err, data) => {
    if (err) throw err;
    registrationContent = data;
});

http.createServer((req, res) => {
    let url = req.url;
    res.writeHeader(200, { "content-Type": "text/html" });
    switch (url) {
        case "/project":
            res.write(projectContent);
            res.end();
            break;
        case "/registration":
            res.write(registrationContent);
            res.end();
            break;
        default:
            res.write(homeContent);
            res.end();
            break;
    }
}).listen(args.port);

