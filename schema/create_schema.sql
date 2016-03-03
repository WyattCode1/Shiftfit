DROP SEQUENCE IF EXISTS shiftfit_user_sequence;
CREATE SEQUENCE shiftfit_user_sequence START WITH 1;

DROP TABLE IF EXISTS shiftfit_user;
CREATE TABLE shiftfit_user (
	id          integer PRIMARY KEY,
	email       varchar(100) NOT NULL,
	user_name   varchar(100),
	first_name  varchar(100),
	last_name   varchar(100),
	password    varchar(255),
	rol_id	    integer NOT NULL DEFAULT 1
);

INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id) VALUES (nextval('shiftfit_user_sequence'), 'lanza@shiftfit.com', 'lanza', 'Luis', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Lanzafame', 2);
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id) VALUES (nextval('shiftfit_user_sequence'), 'rodri@shiftfit.com', 'rigo', 'Rodrigo', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Avila', 2);
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id) VALUES (nextval('shiftfit_user_sequence'), 'jmbarreirop@gmail.com', 'kEme', 'Juan', '$2a$10$lQezIBTrejG2XW/lZS3jUOHBCRQ7HN9uG7BJb2SJj4rpL84w5oXnS', 'Barreiro', 3);
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id) VALUES (nextval('shiftfit_user_sequence'), 'walter@aquila.com', 'walteraq', 'Walter', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Aquila', 1);

DROP TABLE IF EXISTS shiftfit_user_session;
CREATE TABLE shiftfit_user_session (
	session_hash 		varchar(100),
	device			varchar(20),
	shiftfit_user_id	integer,
	expiration		timestamp
);

DROP TABLE IF EXISTS rol;
CREATE TABLE rol (
	id		integer PRIMARY KEY,
	weight	integer NOT NULL,
	name	varchar(100) NOT NULL,
	home	varchar(100) NOT NULL
);

DROP SEQUENCE IF EXISTS rol_sequence;
CREATE SEQUENCE rol_sequence START WITH 1;

INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 1, 'user', '/home');
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 10, 'admin', '/admin');
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 100, 'moderator', '/admin');


DROP SEQUENCE IF EXISTS shift_sequence;
CREATE SEQUENCE shift_sequence START WITH 1;
DROP TABLE IF EXISTS shift;
CREATE TABLE shift (
	id	integer PRIMARY KEY,
	name varchar(100) NOT NULL
);

INSERT INTO shift (id, name) VALUES (nextval('shift_sequence'), 'Crossfit');
