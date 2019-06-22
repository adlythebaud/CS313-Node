const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.json())
  .use(express.urlencoded())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/form'))
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
  .get('/prove09/form', (request, result) => result.render('prove09_views/pages/form'))
  .post('/prove09/results', (request, result) => {


    var rate = calculateRate(parseFloat(request.body.item_weight), request.body.item_type);

    var stamped = "Letters (Stamped)";
    var metered = "Letters (Metered)";
    var flats = "Large Envelopes (Flats)";
    var retail = "First-Class Package Service - Retail";

    var type = "";

    if (request.body.item_type == "stamped") {
      type = stamped;
    }
    if (request.body.item_type == "metered") {
      type = metered;
    }
    if (request.body.item_type == "flats") {
      type = flats;
    }
    if (request.body.item_type == "retail") {
      type = retail;
    }

    result.render('prove09_views/pages/results', {
      rate: rate,
      weight: request.body.item_weight,
      type: type
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

function calculateRate(weight, type) {
  
  if (type == "stamped") {
    if (weight < 0) {
      return "Error. Please enter a valid weight.";
    }

    if (weight >= 0 && weight < 1) {
      return "$0.55";
    }

    if (weight >= 1 && weight < 2) {
      return "$0.70";
    }

    if (weight >= 2.0 && weight < 3.0) {
      return "$0.85";
    }

    if (weight >= 3 && weight < 3.5) {
      return "$1.00";
    }
  }
  if (type == "metered") {
    if (weight < 0) {
      return "Error. Please enter a valid weight.";
    }

    if (weight >= 0 && weight < 1) {
      return "$0.50";
    }

    if (weight >= 1 && weight < 2) {
      return "$0.65";
    }

    if (weight >= 2.0 && weight < 3.0) {
      return "$0.80";
    }

    if (weight >= 3 && weight < 3.5) {
      return "$0.95";
    }
  }
  if (type == "flats") {
    if (weight <= 0 || weight > 13) {
      return "Your envelope is either too heavy or too light.";
    }
    var toAdd = (Math.ceil(weight) - 1) * .15;
    var total = 1 + toAdd;
    var result = total.toPrecision(3);
    return "$" + result;
  }
  if (type == "retail") {
    if (weight > 0 && weight <= 4) {
      return "$3.66";
    }
    if (weight > 4 && weight <= 8) {
      return "$4.39";
    }
    if (weight > 8 && weight <= 12) {
      return "$5.19";
    }
    if (weight > 8 && weight <= 12) {
      return "$5.19";
    }
    if (weight > 12 && weight <= 13) {
      return "$5.71";
    }
  }

  return -1;
}