çDROP SEQUENCE IF EXISTS shiftfit_user_sequence;
CREATE SEQUENCE shiftfit_user_sequence START WITH 1;

DROP TABLE IF EXISTS shiftfit_user;

CREATE TABLE shiftfit_user (
	id          integer PRIMARY KEY,
	email       varchar(100) NOT NULL,
	user_name   varchar(100),
	first_name  varchar(100),
	last_name   varchar(100),
	password    varchar(255),
	face_id		varchar(255),
	city   	    varchar(100),
	location    varchar(100),
	state       varchar(100),
	country     varchar(100),
	phone       varchar(100),
	birthdate   varchar(100),
	rol_id	    integer NOT NULL DEFAULT 1
);

INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'lanza@shiftfit.com', 'lanza', 'Luis', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Lanzafame', 2, 'Caba' , 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'rodri@shiftfit.com', 'rigo', 'Rodrigo', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Avila', 2,'Caba' , 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'jmbarreirop@gmail.com', 'kEme', 'Juan', '$2a$10$lQezIBTrejG2XW/lZS3jUOHBCRQ7HN9uG7BJb2SJj4rpL84w5oXnS', 'Barreiro', 3, 'Caba' , 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'walter@aquila.com', 'walteraq', 'Walter', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Aquila', 1, 'Caba' , 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');

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
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 10, 'admin', '/home');
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 100, 'moderator', '/admin');

DROP SEQUENCE IF EXISTS shift_sequence;
CREATE SEQUENCE shift_sequence START WITH 1;
DROP TABLE IF EXISTS shift;
CREATE TABLE shift (
	id	integer PRIMARY KEY,
	name varchar(100) NOT NULL
);

INSERT INTO shift (id, name) VALUES (nextval('shift_sequence'), 'Crossfit');

DROP SEQUENCE IF EXISTS box_sequence;
CREATE SEQUENCE box_sequence START WITH 1;
DROP TABLE IF EXISTS box;
CREATE TABLE box (
	id	integer PRIMARY KEY,
	name varchar(100) NOT NULL,
	address varchar(100) NOT NULL,
	phone varchar(30) NOT NULL,
	payment_method varchar(30) NOT NULL
);

DROP SEQUENCE IF EXISTS accounting_sequence;
CREATE SEQUENCE accounting_sequence START WITH 1;
DROP TABLE IF EXISTS accounting;
CREATE TABLE accounting (
	id	integer PRIMARY KEY,
	amount varchar(10) NOT NULL,
	description varchar(100) NOT NULL,
	box_id integer NOT NULL
);

DROP TABLE IF EXISTS user_box;
CREATE TABLE user_box (
	user_id	integer NOT NULL,
	box_id integer NOT NULL,
	is_admin boolean NOT NULL default false,
	PRIMARY KEY(user_id, box_id)
);

DROP TABLE IF EXISTS shift_picture;
CREATE TABLE shift_picture (
	id		integer PRIMARY KEY,
	picture_name	varchar(100),
	picture_type	varchar(100),
	picture_file	bytea,
	last_update timestamp with time zone
);

DROP SEQUENCE IF EXISTS shift_picture_sequence;
CREATE SEQUENCE shift_picture_sequence START WITH 1;

DROP TABLE IF EXISTS exercise;
DROP SEQUENCE IF EXISTS exercise_sequence;
CREATE SEQUENCE exercise_sequence START WITH 1;
CREATE TABLE exercise (
	id	integer PRIMARY KEY,
	name varchar(100) NOT NULL,
	tags varchar(255) NOT NULL
);

DROP SEQUENCE IF EXISTS weight_sequence;
DROP INDEX IF EXISTS weight_user_id;
DROP TABLE IF EXISTS weight;

CREATE SEQUENCE weight_sequence START WITH 1;
CREATE TABLE weight (
	id	integer PRIMARY KEY,
	exercise_id integer NOT NULL,
	date DATE NOT NULL,
	user_id integer NOT NULL,
	weight varchar(40),
	reps varchar(40),
	unbroken boolean not null default false
);
CREATE INDEX weight_user_id ON weight ( user_id );
