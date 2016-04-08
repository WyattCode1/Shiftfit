UPDATE class_module SET
	description=$2,
	start_time=$3,
	end_time=$4,
	duration=$5,
	vacancies=$6,
	coach_id=$7,
	category_id=$8,
	monday=$9,
	tuesday=$10,
	wednesday=$11,
	thursday=$12,
	friday=$13,
	saturday=$14,
	sunday=$15
WHERE id=$1
RETURNING id