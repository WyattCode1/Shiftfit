DROP SEQUENCE IF EXISTS shiftfit_user_sequence;
CREATE SEQUENCE shiftfit_user_sequence START WITH 1;

DROP TABLE IF EXISTS shiftfit_user;
CREATE TABLE shiftfit_user (
	id          integer PRIMARY KEY,
	email       varchar(100) NOT NULL,
	user_name   varchar(100),
	first_name  varchar(100),
	password    varchar(255),
	is_admin    bool,
	last_name   varchar(100)
);

INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, is_admin) VALUES (nextval('shiftfit_user_sequence'), 'lanza@shiftfit.com', 'lanza', 'Luis', 'shift', 'Lanzafame', true);
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, is_admin) VALUES (nextval('shiftfit_user_sequence'), 'rodri@shiftfit.com', 'rigo', 'Rodrigo', 'shift', 'Avila', true);
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, is_admin) VALUES (nextval('shiftfit_user_sequence'), 'jmbarreirop@gmail.com', 'kEme', 'Juan', 'expert', 'Barreiro', true);
INSERT INTO shiftfit_user (id, email, user_name, first_name, password, last_name, is_admin) VALUES (nextval('shiftfit_user_sequence'), 'walter@aquila.com', 'walteraq', 'Walter', 'soyelmejoraquilafuncionaperfecto', 'Aquila', false);

DROP TABLE IF EXISTS shiftfit_user_session;
CREATE TABLE shiftfit_user_session (
	session_hash 		varchar(100),
	device			varchar(20),
	shiftfit_user_id	integer,
	expiration		timestamp
);

DROP TABLE IF EXISTS user_type;
CREATE TABLE user_type (
	id		integer PRIMARY KEY,
	type	varchar(100) NOT NULL
);

INSERT INTO user_type (id, type) VALUES (1, 'user');
INSERT INTO user_type (id, type) VALUES (10, 'admin');
INSERT INTO user_type (id, type) VALUES (100, 'moderator');