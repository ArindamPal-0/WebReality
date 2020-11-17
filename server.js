const express = require('express');
const path = require('path');

const port = 3000;

const app = express();

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

app.get('/', (request, response) => {
    response.render('index');
});