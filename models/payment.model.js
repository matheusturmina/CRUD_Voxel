const mongoose = require('mongoose');


//aqui é declarado como será o modelo de dados que vai ser encaminhado para o banco de dados
var paymentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Please insert a Title.'
    },
    value: {
        type: Number,
        required: 'Please insert a Value.'
    },
    date: {
        type: Number,
        required: 'Please insert a Date.'
    },
    externalTax: {
        type: Number,
    },
    comments: {
        type: String
    }
});


// regex para validar o campo 'title'
paymentSchema.path('title').validate((val) => {
    titleRegex = /^[a-zA-Z0-9_ ]{5,100}$/;
    return titleRegex.test(val);
}, 'Title must have between 5 and 100 characters.');

//regex para validar o campo 'value'
paymentSchema.path('value').validate((val) => {
    valueRegex = /^[0-9]*(\.[0-9]{1,2})$/;
    return valueRegex.test(val);
}, 'Value must be a decimal value.');

//regex para validar o campo 'date'
paymentSchema.path('date').validate((val) => {
    dateRegex = /([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))$/;
    return dateRegex.test(val);
}, 'Date must be on the pattern Y-m-d (year-month-day).');

mongoose.model('Payment', paymentSchema);