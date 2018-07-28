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
    over_head_costs INTEGER (50) NOT NULL,
    PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD COLUMN products_sales DECIMAL(10, 4) AFTER stock_quantity;

SELECT * FROM departments;

SELECT * FROM products;


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Macbook", "Technology", 2100, 7);

