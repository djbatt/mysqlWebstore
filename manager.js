
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

function lowInventory() {
    console.log("\nThe following products have less than 5 in stock!\n");

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + res[i].item_id + "\xa0|\xa0" +
            "Product:\xa0" + res[i].product_name + "\xa0|\xa0" +
            "Department:\xa0" + res[i].department_name + "\xa0|\xa0" +
            "Price:\xa0" + res[i].price + "\xa0|\xa0" +
            "Amount in Stock:\xa0" + res[i].stock_quantity + "\n");
        }

        inquireUser();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "list",
                name: "add_inventory",
                message: "Which product would you like to add inventory to?",
                choices: function() {
                    var postingArray = [];
                    for (var i = 0; i < res.length; i++) {
                        console.log("\n" + res[i].item_id + "\xa0|\xa0" +
                        "Product:\xa0" + res[i].product_name + "\xa0|\xa0" +
                        "Department:\xa0" + res[i].department_name + "\xa0|\xa0" +
                        "Price:\xa0" + res[i].price + "\xa0|\xa0" +
                        "Amount in Stock:\xa0" + res[i].stock_quantity + "\n");
                        postingArray.push(res[i].product_name);
                    }
                    return postingArray; // returns postingArray as the choices.
                }
            }
        ]).then(function(answers) {

            var selected_product;
            var selected_product_name = answers.add_inventory;

            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === answers.add_inventory) {
                    selected_product = res[i];
                }
            }

            inquirer.prompt([
                {
                    type: "input",
                    name: "inventory_count",
                    message: "How many\xa0" + selected_product_name + "\xa0 would you like to add?"
                }
            ]).then(function(answers) {
                
                var parseFloatStock = parseFloat(selected_product.stock_quantity);
                var parseFloatCount = parseFloat(answers.inventory_count);

                var updatedStock = parseFloatStock + parseFloatCount;

                var parameters = [
                    {
                        stock_quantity: updatedStock
                    },
                    {
                        item_id: selected_product.item_id
                    }
                ]
                connection.query("UPDATE products SET ? WHERE ?", parameters, function(err, res) {
                    if (err) throw err;
                    console.log("You added\xa0" + parseFloatCount + "\xa0of\xa0" + selected_product_name);
                    inquireUser();
                })
            });
        });
    })
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "What is the product name?"
        },
        {
            type: "input",
            name: "department",
            message: "What is the department?"
        },
        {
            type: "input",
            name: "product_price",
            message: "What is the price?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many do you want to sell?"
        }
    ]).then(function(answers){
        var newProduct = [
            {
                product_name: answers.product,
                department_name: answers.department,
                price: answers.product_price,
                stock_quantity: answers.quantity
            }
        ]

        connection.query("INSERT INTO products SET ?", newProduct, function(err, res) {
            if (err) throw err;

            console.log("New product added!");
            inquireUser();
        })
    })
}