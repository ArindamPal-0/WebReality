const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');

const port = 3000;

const app = express();

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'certificate', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certificate', 'cert.pem'))
}, app);

sslServer.listen(port, () => {
    console.log(`Server listening on https://localhost:${port}`);
});

app.get('/', (request, response) => {
    response.render('index');
});