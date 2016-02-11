SELECT
	su.*
FROM shiftfit_user as su
LEFT JOIN shiftfit_user_sessions ss on ss.zintro_user_id = su.id
WHERE ss.token = $1;