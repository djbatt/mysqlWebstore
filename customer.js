//ask the user which product they want to buy
//ask how many they want to buy
//check if the store has enough, if not let the user know that we dont have enough give them a message
//if you do have enough, update the database quantity, and give the user the total

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
    buyItem();
})

function buyItem() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "list",
                name: "product_purchase",
                message: "Which product would you like to buy?",
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

            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === answers.product_purchase) {
                    selected_product = res[i];
                }
            }

            //console.log(selected_product);

            inquirer.prompt([
                {
                    type: "input",
                    name: "product_count",
                    message: "How many\xa0" + answers.product_purchase + "\xa0would you like to buy?"
                }
            ]).then(function(answers) {

                var parseFloatStock = parseFloat(selected_product.stock_quantity);
                var parseFloatCount = parseFloat(answers.product_count);

                if (parseFloatStock > parseFloatCount) {
                    var updated_stock_quantity = parseFloatStock - parseFloatCount;

                    var parameters = [
                        {
                            stock_quantity: updated_stock_quantity
                        },
                        {
                            id: selected_product.item_id
                        }
                    ]

                    connection.query("UPDATE products SET ? WHERE ?", parameters, function(err, res) {
                        
                    })
                }
                
                //console.log(answers.product_count);
            })
        });
    })
}