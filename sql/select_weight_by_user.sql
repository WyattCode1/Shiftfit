SELECT
	w.id as id,
	w.exercise_id as exercise_id,
	to_char(w.date, 'MM/DD/YYYY') AS date,
	w.user_id as user_id,
	w.weight as weight,
	w.reps as reps,
	w.unbroken as unbroken
FROM
	weight w
WHERE w.user_id = $1
ORDER BY w.date DESC