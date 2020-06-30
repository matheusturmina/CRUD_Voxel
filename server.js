require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const xlsxFile = require('read-excel-file/node');
const multer = require('multer');

var helpers = require('handlebars-helpers')();

const Handlebars = require('handlebars')

const paymentController = require('./controllers/paymentController');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'project/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ 

    handlebars: allowInsecurePrototypeAccess(Handlebars),

    extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.post('/file/upload', upload.single('file'), 
    (req, res) => res.send('<h2>Upload realizado com sucesso</h2>'));

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/payment', paymentController);