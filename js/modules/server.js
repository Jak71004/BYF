// server.js
//Tutorial: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
//var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
    
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        //var bear = new Bear();      // create a new instance of the Bear model
        //bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        //bear.save(function(err) {
            //if (err)
                //res.send(err);

            res.json({ message: 'Bear created! ' + req });
        //});
        
    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
//        Bear.find(function(err, bears) {
//            if (err)
//                res.send(err);
//
            res.json(wagers);
//        });
    });
        
// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:email')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
//        Bear.findById(req.params.bear_id, function(err, bear) {
//            if (err)
//                res.send(err);
//            res.json(bear);
//        });
         console.log(req.params.email);
        var wagerEmail = req.params.email; //parseInt(req.params.id);
        var data = {};
        for (var i=0, len=wagers.length;i<len; i++){
            if(wagers[i].email ===wagerEmail){
                data=wagers[i];
                break;
            }
        }
        console.log(data);
        res.json(data);
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {
        
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
//        Bear.remove({
//            _id: req.params.bear_id
//        }, function(err, bear) {
//            if (err)
//                res.send(err);
//
//            res.json({ message: 'Successfully deleted' });
//        });
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

//var express = require('express'),
//    app = express();
//
//app.all('/wagers', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    next()
//  });
//app.all('/wagers/:id', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    next()
//  });
//app.all('/AddWagers', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    next()
//  });
//
//app.configure(function () {
//    app.use(express.static(__dirname, '/'));
//});
//
//app.get('/wagers/:id', function(req, res, next){
//    var wagerID = parseInt(req.params.id);
//    var data = {};
//    for (var i=0, len=wagers.length;i<len; i++){
//        if(wagers[i].id ===wagerID){
//            data=wagers[i];
//            break;
//        }
//    }
//    res.json(data);
//});
//
//app.get('/wagers', function(req, res, next){
//    res.json(wagers);
//    console.log('Got All Wagers');
//});
//
//app.post('/wagers', function(req, res, next) {
//    console.log('Post!');
//});


////////////////////////////////////////////
/*exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}*/

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
/*var populateDB = function() {

    var wines = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];

    db.collection('wines', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });

};
Another variation of ADD
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
*/
////////////////////////////////////////////////////
//app.listen(8080);

//console.log('Express listening on port 8080');

var wagers = [
    {
        id: 1,
        email:'J@J.com',
        amount:'3'
    },
    {
        id: 2,
        email:'ax@fable.com',
        amount:'0.21'
    }
];
