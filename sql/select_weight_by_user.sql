SELECT
	w.id as id,
	w.exercise_id as exercise_id,
	to_char(w.date, 'MM/DD/YYYY') AS date,
	w.user_id as user_id,
	w.amount as amount,
	w.unbroken as unbroken
FROM weight w
LEFT JOIN exercise e ON (w.exercise_id = e.id)
WHERE w.user_id = $1
AND e.name ilike $2
ORDER BY w.date DESC