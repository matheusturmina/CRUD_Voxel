# Payment Posting System VOXUS

###### Antes de executar o projeto
 1. Instale os pacotes necessários usando o 'npm install.
# Pacotes
    "@handlebars/allow-prototype-access": "^1.0.3",
    "body-parser": "^1.19.0",
    "conventional-changelog": "^3.1.21",
    "express": "^4.17.1",
    "express-handlebars": "^4.0.4",
    "handlebars-helpers": "^0.10.0",
    "moment": "^2.27.0",
    "mongodb": "^3.5.9",
    "mongoose": "^5.9.20",
    "mongoose-plugin-date-format": "^1.1.2",
    "multer": "^1.4.2",
    "nodemon": "^2.0.4",
    "path": "^0.12.7",
    "read-excel-file": "^4.0.6"
  
# Linguagens de Programação
Front-End:<br>
HTML <br>
CSS <br><br>
Back-End:<br>
Node.js<br>
Javascript<br>

# Banco de dados
MongoDB: Nesse projeto foi utilizado o Mongo db.
 
# Configurando o MongoDB
1. Crie um database chamado: 'PaymentPosting'.
2. Dentro desse database, crie uma collection chamada: payments.
3. Inicie o database com as seguintes configurações de conexão:<br>
Hotsname = localhost<br>
Port = 27017<br>
Authentication = None<br>

# Interface WEB
A interface pode ser acessada pelo navegador, url: http://localhost:3000/payment
Ela conta com um total de 5 páginas WEB diferentes para visualização, são elas:
<h5>1. Página '/payment'.</h5>
Essa é a página principal e nela é feito o cadastro de novos pagamentos.<br>
<h5> 2. Página '/payment/list'.</h5> 
Nela é possivel ver a lista de todos os dados do banco de dados. Sendo possivel também edita-los ou apaga-los.<br>
<h5> 3. Página '/payment/_id'.</h5> 
É a página para edição de dados do database.<br>
<h5> 4. Página '/payment/upload'.</h5> 
Página para o upload de dados utilizando um arquivo .xlsx.<br>
<h5> 5. Página '/payment/uploadSucesso'.</h5> 
Apenas uma página confirmando o envio do arquivo.<br>

# Regras para inserção e edição de dados
<h5>Regras válidas para inserção de novos dados manualmente ou via .xlsx e para edição</h5>
- Title: Precisa ter entre 5 e 100 caracteres;<br>
- Value: Precisa ser um número decimal;<br>
- Date: Precisa estar no formato yyyymmdd<br>
- External Tax: É automaticamente calculada como 5% do campo 'Value';<br>
- Comments: Único campo opcional.<br>
