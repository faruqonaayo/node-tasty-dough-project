CREATE TABLE products(
	id SERIAL NOT NULL,
	name VARCHAR(50) NOT NULL,
	price MONEY,
	sales INT,
	category VARCHAR(50) NOT NULL,
	PRIMARY KEY(id)
);

-- Creating  table to store sessions to database
CREATE TABLE "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");


CREATE TABLE cart_products (
	id SERIAL NOT NULL,
	session_id VARCHAR(150) NOT NULL,
	product_id INT NOT NULL,
	doz_quantity INT,
	paid_online BOOL,
	PRIMARY KEY (id),
	FOREIGN KEY (session_id) REFERENCES sessions(sid),
	FOREIGN KEY (product_id) REFERENCES products(id)
);