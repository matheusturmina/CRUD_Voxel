require('./models/db');

// declarando constantes e packages 
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

//Essa variável foi criada para poder retirar o "file.originalname" do storage do multer
var excelProjectName = "projectName";
const paymentController = require('./controllers/paymentController');

// aqui foi preciso habilitar este parametro, pois o handlebars tinha problemas para acessar o banco de dados
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const { execFile } = require('child_process');


//Multer é o package responsavel pelo upload e armazenamento das tabelas na pasta 'project'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'project/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        //file.originalname mantém o nome do arquivo que foi feito o upload
        excelProjectName = file.originalname;
    }
});

// usando o storage para configurar a instância do multer
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


//aqui foi feito uma implementacao do package "read-excel-file" e o "Multer". 
//a idea é a seguinte: toda vez que o Multer fizer o upload de um arquivo, ele vai chamar o package read-excel-file para ler esse arquivo
app.post('/file/upload', upload.single('file'), 
    (req, res) => {

        //aqui foi usado a variavel 'excelProjectName', para indicar qual arquivo deve ser lido
        xlsxFile('./project/'+ excelProjectName).then((rows) => {

            // o package read-excel-file transforma o .xlsx em um array, aqui foi feita uma função para ler cada dado desse array, excluindo o cabeçalho
            // após passar pelo cabeçalho, ao final de cada linha, é possivel ter todos os dados dessa linha armazenados em variáveis especificas para serem adicionados no banco
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
            //excluindo o cabeçalho com esse if
            if (i != 0)
            {
                //ainda dentro do primeiro for, aqui, ao final de cada linha, é adicionado os novos dados a tabela.
                //ainda é feita a validacao dos dados, e caso alguma linha contenha um dado inválido, ela não será adicionada, mas as outras linhas serão
                Payment.insertMany([ 
                    {title: titleExcel, value: valueExcel, date: dateExcel, externalTax: externalTaxExcel, comments: commentsExcel}, 
                ]).then(function(){ 
                    console.log("Data inserted")  // Success 
                }).catch(function(error){ 
                    console.log(error)      // Failure 
                }); }
    
            }
            })
        // redirecionamento caso o upload seja um sucesso
        res.redirect("/payment/uploadSucesso")
        
    }
    );

// porta utilizada nos testes 
app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/payment', paymentController);