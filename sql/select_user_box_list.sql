SELECT
	id,
	email
FROM shiftfit_user u
LEFT JOIN user_box ub ON (ub.user_id = u.id) 
WHERE ub.is_admin IS TRUE
AND ub.box_id = $1