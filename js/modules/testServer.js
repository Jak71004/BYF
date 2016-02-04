#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
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

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;
    var router = express.Router();


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };

    };

    /**
     *  Setting up the router.
     */
    self.configureRouter = function(){
                
        // middleware to use for all requests
        router.use(function(req, res, next) {
            // do logging
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
            res.header("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");

            console.log('Something is happening.');
            next(); // make sure we go to the next routes and don't stop here
        });
        
        // more routes for our API will happen here
        router.route('/wagers')

            // create a wager (accessed at POST http://localhost:8080/api/wagers)
            .post(function(req, res) {

                //var bear = new Bear();      // create a new instance of the Bear model
                //bear.name = req.body.name;  // set the bears name (comes from the request)

                // save the bear and check for errors
                //bear.save(function(err) {
                    //if (err)
                        //res.send(err);

                    res.json({ message: 'wager created! ' + req });
                //});

            })

            // get all the bears (accessed at GET http://localhost:8080/api/wagers)
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
        router.route('/wagers/:email')

            // get the bear with that id (accessed at GET http://localhost:8080/api/wagers/:email)
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
        
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
        
        self.configureRouter();
        
        // all of our routes will be prefixed with /api
        self.app.use('/api', router);
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

