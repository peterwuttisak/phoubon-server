var express = require('express');
var router = express.Router();
var Customer = require('../models/customer');

router.post('/', (req, res, next) => {
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let sex = req.body.sex;
  let customer_type_id = req.body.customer_type_id;
  let telephone = req.body.telephone;
  let email = req.body.email;
  let image = req.body.image;

  if (first_name && last_name && customer_type_id) {
    let customer = {
      first_name: first_name,
      last_name: last_name,
      sex: sex,
      customer_type_id: customer_type_id,
      telephone: telephone,
      email: email,
      image: image
    }

    let db = req.db;
    Customer.save(db, customer)
      .then(() => {
        res.send({ ok: true });
      }, (error) => { 
        res.send({ ok: false, error: error });
       });

  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่ครบถ้วน' });
  }

});

router.get('/:limit/:offset', function(req, res, next) {
  let db = req.db;
  let limit = parseInt(req.params.limit);
  let offset = parseInt(req.params.offset);

  Customer.all(db, limit, offset)
    .then((rows) => {
      let customers = [];
      rows.forEach(v => {
        let obj = {
          id: v.id,
          first_name: v.first_name,
          last_name: v.last_name,
          telephone: v.telephone,
          email: v.email,
          image: v.image ? v.image.toString() : null
        };
        customers.push(obj);
      });
      res.send({ ok: true, rows: customers });
    }, (error) => {
      res.send({ ok: false, error: error });
    });
});

router.get('/customer-types', function(req, res, next) {
  let db = req.db;
  Customer.getCustomerTypes(db)
    .then((rows) => {
      res.send({ ok: true, rows: rows });
    }, (error) => {
      res.send({ ok: false, error: error });
    });
});

router.get('/total', function(req, res, next) {
  let db = req.db;
  Customer.total(db)
    .then((total) => {
      res.send({ ok: true, total: total });
    }, (error) => {
      res.send({ ok: false, error: error });
    });
});

router.delete('/:id', function(req, res, next) {
  let db = req.db;
  let id = req.params.id;

  Customer.remove(db, id)
    .then((total) => {
      res.send({ ok: true });
    }, (error) => {
      res.send({ ok: false, error: error });
    });
});

module.exports = router;
