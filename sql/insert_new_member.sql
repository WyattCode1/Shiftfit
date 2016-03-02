INSERT INTO shiftfit_user (
	id,
	user_name,
	email,
	password,
	first_name,
	last_name)
VALUES (
	nextval('shiftfit_user_sequence'),
	$3||'-'||$4,
	$1,
	$2,
	$3,
	$4)
returning *;