SELECT
	su.*, r.*
FROM shiftfit_user as su
LEFT JOIN rol as r on (r.id = su.rol_id)
LEFT JOIN shiftfit_user_session ss on (ss.shiftfit_user_id = su.id)
WHERE ss.session_hash = $1;