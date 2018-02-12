const mysql = require('mysql2');
const inquirer = require('inquirer');
var Table = require('cli-table');

let currentQuantity;
let currentProduct;
let orderAgain;
let currentProductName;

const connection = mysql.createConnection({
  password: 'tWister@710',
  host: 'localhost',
  user: 'root',
  database: 'bamazon'

});

console.log("\n===========================");
console.log("\nWelcome to Bamazon store!");
console.log("\n===========================");

// gets the list of what we have

var showInventory = function() {

  console.log("\n\nThis is what we have for purchase:\n");

connection.query(

 'SELECT item_id, product_name, price FROM products' ,

 function(error, results) 

  {
    //instantiate table

    var table = new Table({
    head: ['Item ID', 'Item Name', 'Price'],
    colWidths: [10, 20, 10]
    });

    if (error) 
      {
      console.log(error);
      }

    else 
      {
        for (var i = 0; i < results.length; i++) 
        {

          //push values to the table

        table.push(

            [results[i].item_id, results[i].product_name, results[i].price]

                  );
        }

        // show the table
        console.log("\n\n" + table.toString());

        purchaseProcess();
      }
  });



}




var purchaseProcess = function(){

inquirer.prompt(
    [
        {
            name: 'id',
            type: 'input',
            message: '\nPlease enter Item ID of a product you want to buy:',
        },

        {
          name: 'quantity',
          type: 'input',
          message: '\nPlease enter the amount you want to buy:'
        }
    ]

).then((data) =>
       {

  connection.query(

  `SELECT stock_quantity, price, product_name FROM products WHERE item_id = ${data.id}`,


    function(error, results) {

        if (error) {
          console.log(error);

        }

        else {

          currentQuantity = results[0].stock_quantity;
          currentProduct = data.id;
          orderPrice = data.quantity * results[0].price;
          currentProductName = results[0].product_name;

          if (currentQuantity >= data.quantity) {
            console.log("\nYour order summary: " + currentProductName + 
                                    " Amount: " + data.quantity + " Price: " + orderPrice);

            inquirer.prompt(
                [
                  {
                    type: "list",
                    name: "continue",
                    message: "\nDo you want to place your order?",
                    choices: [
                              "Yes",
                              "No"]
                  }


                ]).then(answers => {

                  if (answers.continue === "Yes") {


                  connection.query(

                  'UPDATE products SET ? WHERE ?',

                  [
                    {stock_quantity: currentQuantity - data.quantity},
                    {item_id: currentProduct}

                  ],


                  function (error, results) 

                  {

                        if(error) {
                          console.log(error);
                        }

                        else 

                        {

                          connection.query(

                            `SELECT stock_quantity FROM products WHERE item_id = ${currentProduct}`, 

                            function(error, result){
                            
                                if (error) {
                                  console.log(error);
                                }

                                else {

                                  console.log("\nThank you for purchase!");


                                  inquirer.prompt([

                                      {
                                        type: "list",
                                        name: "orderAgain",
                                        message: "\nDo you want to buy anything else?",
                                        choices: [
                                        "Yes",
                                        "No"]
                                      }

                                    ]).then(answers => {

                                        if (answers.orderAgain === "Yes") {

                                          showInventory();
                                      
                                        }

                                        else {
                                          console.log("\nThank you for visiting our store!");
                                        }


                                        });


                                     }

                            });
                        }
                  })


                          }

                          else {

                                   inquirer.prompt([

                                      {
                                        type: "list",
                                        name: "orderAgain",
                                        message: "\nDo you want continue shopping?",
                                        choices: [
                                        "Yes",
                                        "No"]
                                      }

                                    ]).then(answers => {

                                        if (answers.orderAgain === "Yes") {

                                          showInventory();
                                      
                                        }

                                        else {
                                          console.log("\nThank you for visiting our store!");
                                        }


                                        });

                          }
                      });

                  }


                  // Not enough products

                  else {

                    console.log("\nWe don't have enough in stock!\n");

                      inquirer.prompt([

                                      {
                                        type: "list",
                                        name: "orderAgain",
                                        message: "\nDo you want to change amount or buy anything else?",
                                        choices: [
                                        "Yes",
                                        "No"]
                                      }

                                    ]).then(answers => {

                                        if (answers.orderAgain === "Yes") {

                                          showInventory();
                                        
                                        }

                                        else {
                                          console.log("\nThank you for visiting our store!");
                                        }


                                        });


                  };

               }               
            }
          );

       }).catch((error) =>
                {
                    console.log(error);
                });


}

showInventory();
