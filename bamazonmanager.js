const mysql = require('mysql2');
const inquirer = require('inquirer');
const Table = require('cli-table');

let currentQuantity;

const connection = mysql.createConnection({
  password: 'tWister@710',
  host: 'localhost',
  user: 'root',
  database: 'bamazon'

});

var showInventory = function(type) {

  console.log("\n\nThis is what we have for purchase:\n");

connection.query(

 'SELECT item_id, product_name, price, stock_quantity FROM products' ,

 function(error, results) 

  {
    //instantiate table

    var table = new Table({
    head: ['Item ID', 'Item Name', 'Price', 'Quantity'],
    colWidths: [10, 20, 10, 10]
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

            [results[i].item_id, results[i].product_name, results[i].price, results[i].stock_quantity]

                  );
        }

        // show the table
        console.log("\n\n" + table.toString());
        if(type === 'Add to Inventory') {
          addToInventory();
        }


      }
  });



}

function lowInventory() {

	connection.query(

 'SELECT item_id, product_name, stock_quantity FROM products' ,

 function(error, results) 

 {

 var table = new Table({
    head: ['Item ID', 'Item Name', 'Quantity'],
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
        	if (results[i].stock_quantity  < 5) {
          //push values to the table

        table.push(

            [results[i].item_id, results[i].product_name, results[i].stock_quantity]

                  );
        }

    }

        // show the table
        console.log("\n\n" + table.toString());
      }
  });
}



const options = {

	'View Products for Sale': function(){

		showInventory();
	},

	'View Low Inventory': function(){
		lowInventory();
	},

	'Add to Inventory': function(type){
		showInventory(type);
	},

	'Add new product': function(){
		console.log("New");
	}

}

function addToInventory(){
  

	inquirer.prompt(
    [
        {
            name: 'item',
            type: 'input',
            message: 'Enter Item ID you want to add to',
         
        },

         {
            name: 'amount',
            type: 'input',
            message: 'Enter new amount in stock for this item',
         
        }
    ]
).then((data) =>

       {
          

// connection.query('SELECT stock_quantity FROM products WHERE item_id = ' + data.item, 

// 	function(error, results) {

// currentQuantity = results[0].stock_quantity;
// console.log(currentQuantity);

// })

       	connection.query(

                  'UPDATE products SET ? WHERE ?',

                  [
                    {stock_quantity: data.amount},
                    {item_id: data.item}

                  ],


                  function (error, results) 

                  {

                        if(error) {
                          console.log(error);
                        }
                  console.log("New amount set");
                    
                   });

       }).catch((error) =>
                {
                    console.log(error);
                });

}

function newProduct() {

inquirer.prompt(
    [
        {
            name: 'item_name',
            type: 'input',
            message: 'Please enter product name',
         
        },

         {
            name: 'department',
            type: 'input',
            message: 'Please department name for this item',
         
        },

         {
            name: 'amount',
            type: 'input',
            message: 'Enter amount in stock for this item',
         
        },

        {
            name: 'price',
            type: 'input',
            message: 'Please enter price for this item',
         
        }

    ]
).then((data) =>

       {
          

        connection.query(

          'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)',



                  [
                    data.name,
                    data.department,
                    data.price,
                    data.amount
                  ],


                  function (error, results) 

                  {

                        if(error) {
                          console.log(error);
                        }
                  console.log("New item added");
                    
                   });

       }).catch((error) =>
                {
                    console.log(error);
                });

}

inquirer.prompt(
    [
        {
            name: 'actions',
            type: 'list',
            message: 'Menu Options:',
            choices: ['View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product']
        }
    ]
).then((data) =>
       {
           options[data.actions]();
       }).catch((error) =>
                {
                    console.log(error);
                });


