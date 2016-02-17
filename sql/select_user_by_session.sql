SELECT
	su.*
FROM shiftfit_user as su
LEFT JOIN shiftfit_user_session ss on ss.shiftfit_user_id = su.id
WHERE ss.session_hash = $1;