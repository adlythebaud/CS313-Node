require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const PORT = process.env.PORT || 5500;

const {
  Pool,
  Client
} = require('pg');

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

const pg_client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASS,
  port: process.env.PGPORT,
});

// connect to DB. Make sure to disconnect somewhere.
pg_client.connect();

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

function logRequest(req, res, next) {
  console.log("Received a request for: " + req.url);
  next();
}

function verifyLogin(req, res, next) {
  if (!req.session.username) {
    console.log("no user is logged in");
    var result = {
      success: false,
      message: "Access Denied"
    };
    res.status(401).json(result);
  } else {
    next();
  }
}

function getServerTime(req, res) {
  var currentTime = new Date();
  res.json({
    success: true,
    time: currentTime
  });
}

function handleLogin(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "admin" && password === "password") {
    res.json({
      success: true
    });
    req.session.username = username;
    req.session.save();
  } else {
    res.json({
      success: false
    });
  }
}

function handleLogout(req, res) {
  if (req.session.username) {
    sessionID = req.sessionID;
    req.session.destroy(function sendLogoutSuccessResponse(err) {
      if (err) {
        console.log(err);
      }
      res.json({
        success: true
      });
    });
  } else {
    res.json({
      success: false
    });
  }
}

function getRestaurants(req, response, next) {

  if (req.query.input) {
    googleMapsClient.findPlace({
      input: req.query.input,
      inputtype: 'textquery',
      fields: ['name', 'formatted_address', 'place_id']
    }, (err, res) => {
      if (!err) {              
        response.json(res.json.candidates);
      } else {
        console.log("Error encountered in querying Google Maps API: " + err);
      }
    });
  }
  
  // get all restaurants
  if (!req.query.input) {
    // create query
    const getRestaurantText = 'SELECT * FROM project_2.restaurants';
    
    // execute query
    pg_client.query(getRestaurantText, (err, res) => {
      if (err) throw (err);
      
      // send this back to client. How?
      response.json(res.rows);

    });
  }
}

function saveRestaurantInDB(req, response, next) {
  // get parameters sent from UI
  var name = req.body.name;
  var formatted_address = req.body.formatted_address;
  var place_id = req.body.place_id;

  // create query
  const insertRestaurantText = 'INSERT INTO project_2.restaurants(place_id, name, formatted_address) VALUES ($1, $2, $3)';
  const insertRestaurantValues = [place_id, name, formatted_address];

  // execute query
  pg_client.query(insertRestaurantText, insertRestaurantValues, (err, res) => {
    if (err) throw(err);

    pg_client.query('COMMIT', (err) => {
      if (err) {
        console.error('Error committing transaction', err.stack);
        return;
      }      
    });
    
    // send this back to client. How?
    response.json({success: true});

  });

}

getRestaurantMenu = (req, res, next) => {

}

addMenuItem = (req, res, next) => {
  pg_client.query(
    'INSERT INTO project_2.restaurant_menu_items(name, place_id, health_score) VALUES ($1, $2, $3)',
    [req.body.name, req.body.place_id, req.body.health_score],
    (err, response) => {
      if (err) throw(err);

      pg_client.query('COMMIT', (err) => {
        if (err) {
          console.error('Error committing transaction', err.stack);
          return;
        }      
      });

      // send this back to client. How?
      response.json({success: true});
    }
  );
}

express()
  .use(express.json())
  .use(express.urlencoded())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(session({
    name: 'server-session-cookie-id',
    secret: 'my express secret',
    saveUninitialized: true,
    resave: false
  }))
  .use(logRequest)
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
  .get('/healthie', (req, res) => {    
    res.render('pages/project_2/healthie');
  })
  .get('/teach_11', (req, res) => res.render('pages/teach_11/teach_11'))
  .get('/teach_12', (req, res) => res.render('pages/teach_12/teach_12'))
  .post('/login', handleLogin)
  .post('/logout', handleLogout)
  .get('/getServerTime', verifyLogin, getServerTime)
  .get('/restaurants', getRestaurants)
  .post('/restaurants', saveRestaurantInDB)
  .get('/restaurantMenu', getRestaurantMenu)
  .post('/menu_item', addMenuItem)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));