SELECT
	b.id as id,
	ub.is_admin as is_admin,
	ub.user_id as user_id,
	b.name as name,
	b.address as address
FROM user_box ub
LEFT JOIN box b on (b.id = ub.box_id)
WHERE ub.user_id = $1
ORDER BY b.id