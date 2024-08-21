CREATE TABLE products(
	id SERIAL NOT NULL,
	name VARCHAR(50) NOT NULL,
	price MONEY,
	sales INT,
	category VARCHAR(50) NOT NULL,
	PRIMARY KEY(id)
);
