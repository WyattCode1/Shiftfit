SELECT
	su.id as user_id,
	su.email as email,
	su.user_name as user_name,
	su.first_name as first_name,
	su.last_name as last_name,
	su.password as password,
	su.face_id as face_id,
	su.city as city,
	su.location as location,
	su.state as state,
	su.country as country,
	su.phone as phone,
	su.birthdate as birthdate,
	r.id as rol_id,
	r.weight as weight,
	r.name as rol_name,
	r.home as home
FROM shiftfit_user as su
LEFT JOIN rol as r on (r.id = su.rol_id)
LEFT JOIN shiftfit_user_session ss on (ss.shiftfit_user_id = su.id)
WHERE ss.session_hash = $1;