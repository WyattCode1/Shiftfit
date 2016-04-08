DROP SEQUENCE IF EXISTS shiftfit_user_sequence;
DROP SEQUENCE IF EXISTS rol_sequence;
DROP SEQUENCE IF EXISTS shift_sequence;
DROP SEQUENCE IF EXISTS box_sequence;
DROP SEQUENCE IF EXISTS shift_picture_sequence;
DROP SEQUENCE IF EXISTS weight_sequence;
DROP SEQUENCE IF EXISTS exercise_sequence;
DROP SEQUENCE IF EXISTS category_sequence;
DROP SEQUENCE IF EXISTS class_module_sequence;
DROP SEQUENCE IF EXISTS accounting_sequence;
DROP SEQUENCE IF EXISTS wod_type_sequence;
DROP SEQUENCE IF EXISTS wod_week_sequence;
DROP SEQUENCE IF EXISTS athlete_type_box_sequence; 

DROP INDEX IF EXISTS weight_user_id;

DROP TABLE IF EXISTS shiftfit_user_session;
DROP TABLE IF EXISTS user_box;
DROP TABLE IF EXISTS weight;
DROP TABLE IF EXISTS shiftfit_user;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS accounting;
DROP TABLE IF EXISTS shift;
DROP TABLE IF EXISTS shift_picture;
DROP TABLE IF EXISTS exercise;
DROP TABLE IF EXISTS class_module;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS wod_type;
DROP TABLE IF EXISTS athlete_type_box; 
DROP TABLE IF EXISTS wod_week;
DROP TABLE IF EXISTS box;

CREATE SEQUENCE rol_sequence START WITH 1;
CREATE SEQUENCE shift_sequence START WITH 1;
CREATE SEQUENCE box_sequence START WITH 1;
CREATE SEQUENCE accounting_sequence START WITH 1;
CREATE SEQUENCE shift_picture_sequence START WITH 1;
CREATE SEQUENCE exercise_sequence START WITH 1;
CREATE SEQUENCE weight_sequence START WITH 1;
CREATE SEQUENCE category_sequence START WITH 1;
CREATE SEQUENCE class_module_sequence START WITH 1;
CREATE SEQUENCE shiftfit_user_sequence START WITH 1;
CREATE SEQUENCE wod_type_sequence START WITH 1;
CREATE SEQUENCE wod_week_sequence START WITH 1;
CREATE SEQUENCE athlete_type_box_sequence START WITH 1;

CREATE TABLE rol (
	id			integer PRIMARY KEY,
	weight		integer NOT NULL,
	name		varchar(100) NOT NULL,
	home		varchar(100) NOT NULL
);

CREATE TABLE shiftfit_user (
	id			integer PRIMARY KEY,
	email		varchar(100) NOT NULL,
	user_name	varchar(100),
	first_name	varchar(100),
	last_name	varchar(100),
	password	varchar(255),
	face_id		varchar(255),
	city		varchar(100),
	location	varchar(100),
	state		varchar(100),
	country		varchar(100),
	phone		varchar(100),
	birthdate	varchar(100),
	rol_id		integer NOT NULL DEFAULT 1 REFERENCES rol
);

CREATE TABLE shiftfit_user_session (
	session_hash		varchar(100),
	device				varchar(20),
	shiftfit_user_id	integer REFERENCES shiftfit_user,
	expiration			timestamp
);

CREATE TABLE shift (
	id				integer PRIMARY KEY,
	name			varchar(100) NOT NULL
);

CREATE TABLE box (
	id				integer PRIMARY KEY,
	name			varchar(100) NOT NULL,
	address			varchar(100) NOT NULL,
	phone			varchar(30) NOT NULL,
	payment_method	varchar(30) NOT NULL,
	is_active		bool default true not null
);

CREATE TABLE accounting (
	id				integer PRIMARY KEY,
	amount			varchar(10) NOT NULL,
	description		varchar(100) NOT NULL,
	box_id			integer NOT NULL REFERENCES box
);

CREATE TABLE user_box (
	user_id			integer NOT NULL REFERENCES shiftfit_user,
	box_id 			integer NOT NULL REFERENCES box,
	rol_id			integer NOT NULL DEFAULT 1 REFERENCES rol,
	PRIMARY KEY		(user_id, box_id)
);

CREATE TABLE shift_picture (
	id				integer PRIMARY KEY,
	picture_name	varchar(100),
	picture_type	varchar(100),
	picture_file	bytea,
	last_update		timestamp with time zone
);

CREATE TABLE exercise (
	id				integer PRIMARY KEY,
	name			varchar(100) NOT NULL,
	tags			varchar(255),
	by_reps			bool NOT NULL,
	by_weight		bool NOT NULL
);

CREATE TABLE weight (
	id				integer PRIMARY KEY,
	exercise_id 	integer NOT NULL REFERENCES exercise,
	date			timestamp with time zone,
	user_id			integer NOT NULL REFERENCES shiftfit_user,
	amount			varchar(5) NOT NULL,
	unbroken		boolean not null default false
);

CREATE TABLE category (
	id			integer PRIMARY KEY,
	name		varchar(100) NOT NULL,
	color		varchar(7) NOT NULL,
	box_id		integer NOT NULL REFERENCES box
);

CREATE TABLE class_module (
	id			integer PRIMARY KEY,
	description	varchar(100) NOT NULL,
	start_time	time without time zone,
	end_time	time without time zone,
	duration	integer NOT NULL,
	vacancies	integer NOT NULL,
	coach_id	integer NOT NULL,
	category_id	integer NOT NULL REFERENCES category,
	box_id		integer NOT NULL REFERENCES box,
	monday		boolean default false not null,
	tuesday		boolean default false not null,
	wednesday	boolean default false not null,
	thursday	boolean default false not null,
	friday		boolean default false not null,
	saturday	boolean default false not null,
	sunday		boolean default false not null
);

CREATE TABLE wod_type (
	id		integer PRIMARY KEY,
	name	varchar(100) NOT NULL
);

CREATE TABLE athlete_type_box (
	id				integer PRIMARY KEY, 
	name			varchar(100) NOT NULL, 
	description		varchar(250), 
	box_id 			integer NOT NULL REFERENCES box 
);

CREATE TABLE wod_week (
	id					integer PRIMARY KEY,
	name				varchar(100),
	publish_date		timestamp,
	wod_text 			text,
	box_id 				integer not null REFERENCES box,
	category_box_id 	integer not null REFERENCES category,
	athlete_type_box_id integer REFERENCES athlete_type_box,
	public_wod 			boolean not null default false
);

CREATE INDEX weight_user_id ON weight ( user_id );

INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 1, 'user', '/home');
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 250, 'coach', '/home');
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 500, 'head_coach', '/home');
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 750, 'admin', '/home');
INSERT INTO rol (id, weight, name, home) VALUES (nextval('rol_sequence'), 1000, 'root', '/admin');

INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'lanza@shiftfit.com', 'lanza', 'Luis', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Lanzafame', 3, 'Caba', 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'rodri@shiftfit.com', 'rigo', 'Rodrigo', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Avila', 4, 'Caba', 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'jmbarreirop@gmail.com', 'kEme', 'Juan', '$2a$10$lQezIBTrejG2XW/lZS3jUOHBCRQ7HN9uG7BJb2SJj4rpL84w5oXnS', 'Barreiro', 5, 'Caba', 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, rol_id, city, location, state, country, phone, birthdate) VALUES (nextval('shiftfit_user_sequence'), 'walter@aquila.com', 'walteraq', 'Walter', '$2a$10$lQezIBTrejG2XW/lZS3jUOs9YmCOLMEH7RULEkQNVmqTYWXbpil6u', 'Aquila', 1, 'Caba', 'Directorio 934', 'Buenos aires', 'Argentina', '5555555', '25/05/1986');

INSERT INTO shift (id, name) VALUES (nextval('shift_sequence'), 'Crossfit');

INSERT INTO wod_type (id, name) VALUES (nextval('wod_type_sequence'), 'AMRAP');
INSERT INTO wod_type (id, name) VALUES (nextval('wod_type_sequence'), 'EMOM');
INSERT INTO wod_type (id, name) VALUES (nextval('wod_type_sequence'), 'TIME CAP');
INSERT INTO wod_type (id, name) VALUES (nextval('wod_type_sequence'), 'BENCHMARKS');