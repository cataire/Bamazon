# Bamazon

A command line shopping application that uses Node.js and MySQL and allows users buy products.

## Customer View Level

On the Customer level the app allows user to see the inventory, enter the item and the amount that they want to buy, see the order summary and place their order. If there is not sufficient amount of products the user will be prompted to change the amount or select another item.



On the backend the app makes the request to MySQL database and updates the amount when the user makes the purchase.

## Manager View Level

On the Manager level user can perform following actions:

* View Inventory:
		The app makes request to the MySQL database and retrieves information of what is in stock. The user get a table with all items names, prices, departments and amount in stock;

* View Low Inventory:
		User gets a table with items that have amount of five or less; 

* Change the amount of the items in stock:
		User can update the amount for any item in the database;

* Add New Product to the inventory:
		User can add a new product into the database;

##### Technologies used:

* Node.js
* MySQL
* npm packages:
	* inquirer,
	* cli-table,
	* mysql2

##### Contributors

Maria Kuznetsova
