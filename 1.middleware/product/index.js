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
    <h1>Product</h1>
    <p>Product microservices for Online Store</p>
    <hr>
    <p>Version: <em>${version}</em></p>
    </div>`);
});

// -- Populate schema.Products with standard product master
app.post('/prepare', (req, res) => {
    MongoClient.connect(dburl, function (err, client) {
        if (!err) {
            console.log("> Connected to database...");
            const db = client.db(config.database.schema);
            let uploadProductMaster = () => {
                let products = require('./product-master.json');
                let productID = Math.floor(Math.random() * Math.floor(100 - 50) + 50);
                products.forEach((product) => {
                    product['product_id'] = "P00" + productID;
                    productID++;
                    db.collection('products').insertOne(product).then(() => {
                        console.log("> " + product['product_id'] + " inserted...");
                    }).catch((err) => {
                        console.log("!! Could not insert " + productID + " : " + JSON.stringify(err));
                    });
                }); // forEach
                db.collection('products').find({}).toArray((err, docs) => {
                    console.log("> Found " + docs.length + " records.");
                    client.close();
                    res.json(docs);
                }); // listProducts
            }; // uploadProductMaster
            db.collection('products').drop()
                .then(() => {
                    uploadProductMaster();
                }).catch((err) => {
                    uploadProductMaster();
                }); // drop
        }
        else {
            console.log("!! Unable to connect to server.");
            console.log(err.toString());
            res.json({ error: err.name, message: err.toString() });
        }
    });
});

// -- Retrieve all products
app.get('/', (req, res) => {
    MongoClient.connect(dburl, function (err, client) {
        if (!err) {
            console.log("> Connected to database...");
            const db = client.db(config.database.schema);
            db.collection('products').find({}).toArray((err, docs) => {
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

// -- Retrieve product with product_id
app.get('/:id', (req, res) => {
    MongoClient.connect(dburl, function (err, client) {
        if (!err) {
            console.log("> Connected to database...");
            const db = client.db(config.database.schema);
            db.collection('products').find({ "slug": req.params['id'] }).toArray((err, docs) => {
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
console.log(`Product: Ready`);