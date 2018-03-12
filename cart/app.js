var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , bodyParser = require("body-parser")
    , app = express()
    , _ = require('lodash');


app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

//app.use(morgan("dev", {}));
var cart = [];

app.post("/add", function (req, res, next) {
    var obj = req.body;
    console.log("add ");
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));
    // var obj = JSON.parse(body);
    // console.log('addToCart id '+id)
    var max = 0;
    var ind = 0;
    if (cart["" + obj.custId] === undefined)
        cart["" + obj.custId] = [];
    var c = cart["" + obj.custId];
    for (ind = 0; ind < c.length; ind++)
        if (max < c[ind].cartid)
            max = c[ind].cartid;
    var cartid = max + 1;
    var data = {
        "cartid": cartid,
        "productID": obj.productID,
        "name": obj.name,
        "price": obj.price,
        "image": obj.image,
        "quantity": obj.quantity
    };
    console.log(JSON.stringify(data));

    // finding the copies of the product in the existing cart object. Then summing up no of occurrences to form quantity var.
    var found = false;

    c.forEach(function (product) {
        if (product.productID === obj.productID) {
            found = true;
            product.quantity = parseInt(product.quantity) + parseInt(obj.quantity);
        }
    });

    if (!found) {
        c.push(data);
    }

    res.status(201);
    res.send("");


});

app.delete("/cart/:custId/items/:id", function (req, res, next) {
    var customerId = req.params.custId;

    // identifying the product to be removed. Finding its index in the cart for later deletion.
    // Using lodash to get away from coding lowest level operations on array manipulation
    var indexToDelete = _.findIndex(cart[customerId], {productID: parseInt(req.params.id)});

    // removing product from cart array for a given customer
    if (indexToDelete !== -1) {
        _.remove(cart[customerId], function (object, i) {
            return i === indexToDelete;
        });
    }
    console.log("*** Delete item from cart: for custId " + req.url + ' ' + req.params.id.toString());
    console.log("delete ");

    res.send(' ');

});


app.get("/cart/:custId/items", function (req, res, next) {
    var custId = req.params.custId;
    console.log("getCart" + custId);


    console.log('custID ' + custId);


    console.log(JSON.stringify(cart["" + custId], null, 2));

    res.send(JSON.stringify(cart["" + custId]));
    console.log("cart sent");

});


var server = app.listen(process.env.PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});