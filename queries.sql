DROP TABLE order_products;
DROP TABLE orders;
DROP TABLE cart_products;
DROP TABLE products;
DROP TABLE sessions;

-- Creating  table to store sessions to database
CREATE TABLE "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");


CREATE TABLE products(
	id SERIAL NOT NULL,
	name VARCHAR(50) NOT NULL,
	price MONEY,
	category VARCHAR(50) NOT NULL,
	imageurl VARCHAR(150) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE orders(
	id SERIAL NOT NULL,
	customer_name VARCHAR(100) NOT NULL,
	pickup_date DATE NOT NULL,
	pickup_time TIME NOT NULL,
	mobile CHAR(10) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE order_products(
	id SERIAL NOT NULL,
	product_id INT NOT NULL,
	order_id INT NOT NULL,
	doz_quantity INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (product_id) REFERENCES products(id),
	FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE cart_products (
	id SERIAL NOT NULL,
	session_id VARCHAR(150) NOT NULL,
	product_id INT NOT NULL,
	doz_quantity INT,
	PRIMARY KEY (id),
	FOREIGN KEY (session_id) REFERENCES sessions(sid),
	FOREIGN KEY (product_id) REFERENCES products(id)
);

