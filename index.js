const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/form', (req, res) => {
    res.render('pages/form');
  })
  .get('/math', (req, res) => {
    // do my math here.
    var num_1 = parseInt(req.query.operand_1);
    var num_2 = parseInt(req.query.operand_2);
    var result = -1;
    if (req.query.operator == "add") {
      result = num_1 + num_2;
    }
    if (req.query.operator == "subtract") {
      result = num_1 - num_2;
    }
    if (req.query.operator == "multiply") {
      result = num_1 * num_2;
    }
    if (req.query.operator == "divide") {
      result = num_1 / num_2;
    }

    console.log(result);
    res.render('pages/math', {
      result: result
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));