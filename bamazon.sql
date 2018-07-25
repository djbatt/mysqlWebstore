DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER (50) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (50) NOT NULL,
    department_name VARCHAR (50) NOT NULL,
    price DECIMAL (10, 4) NOT NULL,
    stock_quantity INTEGER (50) UNSIGNED NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	department_id INTEGER (50) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR (50) NOT NULL,
    over_head_costs INTEGER (50) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Technology", 1400, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cabinet", "Furniture", 320, 8);
