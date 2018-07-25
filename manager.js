//List a set of menu options:
//View Products for Sale
//View Low Inventory
//Add to Inventory
//Add New Product
//If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
//If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
//If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
//If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID:\xa0" + connection.threadId + "\n");
    inquireUser();
})

function inquireUser() {
    inquirer.prompt([
        {
            type: "list",
            name: "questionOne",
            message: "Would you like to POST and item, or BID on an item?",
            choices: ["READ", "LOW INVENTORY", "ADD TO INVENTORY", "ADD A PRODUCT", "QUIT"]
        }
    ]).then(function(answers) {
        switch (answers.questionOne) {
            case "READ":
            readProducts();
            break;
            case "LOW INVENTORY":
            lowInventory();
            break;
            case "ADD TO INVENTORY":
            addInventory();
            break;
            case "ADD A PRODUCT":
            addProduct();
            break;
            case "QUIT":
            console.log("Exiting application...")
            connection.end();
            break;
        }
    })
}

function readProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + res[i].item_id + "\xa0|\xa0" +
            "Product:\xa0" + res[i].product_name + "\xa0|\xa0" +
            "Department:\xa0" + res[i].department_name + "\xa0|\xa0" +
            "Price:\xa0" + res[i].price + "\xa0|\xa0" +
            "Amount in Stock:\xa0" + res[i].stock_quantity + "\n");
        }
        inquireUser();
    })
}