require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const xlsxFile = require('read-excel-file/node');
const multer = require('multer');
const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');
var projectNumber = 0;

var helpers = require('handlebars-helpers')();

const Handlebars = require('handlebars')
var excelProjectName = "projectName";
const paymentController = require('./controllers/paymentController');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { execFile } = require('child_process');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'project/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        excelProjectName = file.originalname;
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
    (req, res) => {
        xlsxFile('./project/'+ excelProjectName).then((rows) => {

            for (i in rows){
                   for (j in rows[i]){
    
                       if (i != 0 && j == 0){
                           var titleExcel = rows[i][j];
                       } else if (i != 0 && j == 1){
                            var dateExcel = rows[i][j];
                       } else if (i != 0 && j == 2){
                            var valueExcel = rows[i][j];
                       } else if (i != 0 && j == 3){
                            var commentsExcel = rows[i][j];
                            var externalTaxExcel = Number(valueExcel*0.05);
                       }
                       
            }
            if (i != 0)
            {
                Payment.insertMany([ 
                    {title: titleExcel, value: valueExcel, date: dateExcel, externalTax: externalTaxExcel, comments: commentsExcel}, 
                ]).then(function(){ 
                    console.log("Data inserted")  // Success 
                }).catch(function(error){ 
                    console.log(error)      // Failure 
                }); }
    
            }
            })
        res.redirect("/payment/uploadSucesso")
        
    }
    );

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/payment', paymentController);