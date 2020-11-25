'use strict';
// const rollout = "development";
const rollout = "production";

const PORT = 8080;
const HOST = '0.0.0.0';

const config = require('./config.json');
const version = require('./package.json').version;

const express = require('express');
const app = express();
var bodyParser = require('body-parser');

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -- CORS enable
app.use(function (req, res, next) {
    console.log(new Date().getTime().toString() + " : Received request on " + req.path);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// -- Setup database client
const MongoClient = require('mongodb').MongoClient;
const dburl = "mongodb://" + config.database.user + ":" + config.database.password + "@" + config.database.server[rollout] + ":" + config.database.port;


// -- Ping
app.get('/ping', (req, res) => {
    res.send(`<div style="text-align:center;margin-top:20%;">
    <h1>Order</h1>
    <p>Order microservices for Online Store</p>
    <hr>
    <p>Version: <em>${version}</em></p>
    </div>`);
});

// -- Empty orders table
app.post('/prepare', (req, res) => {
    MongoClient.connect(dburl, function (err, client) {
        if (!err) {
            console.log("> Connected to database...");
            const db = client.db(config.database.schema);
            let getOrders = () => {
                db.collection('orders').find({}).toArray((err, docs) => {
                    console.log("> Found " + docs.length + " records.");
                    client.close();
                    res.json(docs);
                }); // listOrders
            }; // getOrders
            db.collection('orders').drop()
                .then(() => {
                    getOrders();
                }).catch((err) => {
                    getOrders();
                }); // drop
        }
        else {
            console.log("!! Unable to connect to server.");
            console.log(err.toString());
            res.json({ error: err.name, message: err.toString() });
        }
    });
});

// -- Create new order
app.post('/', (req, res) => {
    console.log(req.body);
    MongoClient.connect(dburl, function (err, client) {
        if (!err) {
            console.log("> Connected to database...");
            const db = client.db(config.database.schema);
            let order = {
                order_id: new Date().getTime().toString(),
                order_date: new Date().getTime(),
                items: req.body.items,
                total: req.body.total
            };
            db.collection('orders').insertOne(order)
                .then(() => {
                    client.close();
                    res.json(order);
                }).catch((err) => {
                    res.json(err);
                });
        }
        else {
            console.log("!! Unable to connect to server.");
            console.log(err.toString());
            res.json({ error: err.name, message: err.toString() });
        }
    });
});

// -- Retrieve all orders
app.get('/', (req, res) => {
    MongoClient.connect(dburl, function (err, client) {
        if (!err) {
            console.log("> Connected to database...");
            const db = client.db(config.database.schema);
            db.collection('orders').find({}).toArray((err, docs) => {
                console.log("> Found " + docs.length + " records.");
                client.close();
                res.json(docs);
            });
        }
        else {
            console.log("!! Unable to connect to server.");
            console.log(err.toString());
            res.json({ error: err.name, message: err.toString() });
        }
    });
});

// -- Retrieve order with order_id
app.get('/:id', (req, res) => {
    MongoClient.connect(dburl, function (err, client) {
        if (!err) {
            console.log("> Connected to database...");
            const db = client.db(config.database.schema);
            db.collection('orders').find({ "order_id": req.params['id'] }).toArray((err, docs) => {
                console.log("> Found " + docs.length + " records.");
                client.close();
                res.json(docs);
            });
        }
        else {
            console.log("!! Unable to connect to server.");
            console.log(err.toString());
            res.json({ error: err.name, message: err.toString() });
        }
    });
});

app.listen(PORT, HOST);
console.log(`Order: Ready`);