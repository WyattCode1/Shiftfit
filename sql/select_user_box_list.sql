SELECT
	u.id,
	u.email
FROM shiftfit_user u
LEFT JOIN user_box ub ON (ub.user_id = u.id) 
LEFT JOIN rol r ON (r.id = ub.rol_id) 
WHERE ub.box_id = $1
AND r.weight >= 750