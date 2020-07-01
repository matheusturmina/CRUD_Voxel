const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');
const xlsxFile = require('read-excel-file/node');


function insertRecord(req, res) {
    var payment = new Payment();
    payment.title = req.body.title;
    payment.value = req.body.value;
    payment.date = req.body.date;
    payment.externalTax = req.body.value*0.05;
    payment.comments = req.body.comments;
    payment.save((err, doc) => {
        if (!err)
            res.redirect('payment/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("payment/addOrEdit", {
                    viewTitle: "Insert Payment",
                    payment: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Payment.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('payment/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("payment/addOrEdit", {
                    viewTitle: 'Update Payment',
                    payment: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'title':
                body['titleError'] = err.errors[field].message;
                break;
            case 'date':
                body['dateError'] = err.errors[field].message;
                break;
            case 'value':
                body['valueError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}


router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        
        updateRecord(req, res);
});



router.get('/', (req, res) => {
    res.render("payment/addOrEdit", {
        viewTitle: "Insert Payment"
    });
});

router.get('/list', (req, res) => {
    Payment.find((err, docs) => {
        if (!err) {
            res.render("payment/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving payment list :' + err);
        }
    });
});

router.get('/upload', (req, res) => {
    Payment.find((err, docs) => {
        if (!err) {
            res.render("payment/upload", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving payment list :' + err);
        }
    });
});

router.get('/uploadSucesso', (req, res) => {
    Payment.find((err, docs) => {
        if (!err) {
            res.render("payment/uploadSucesso", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving payment list :' + err);
        }
    });
});

router.get('/:id', (req, res) => {
    Payment.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("payment/addOrEdit", {
                viewTitle: "Update Payment",
                payment: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Payment.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/payment/list');
        }
        else { console.log('Error in payment delete :' + err); }
    });
});

module.exports = router;