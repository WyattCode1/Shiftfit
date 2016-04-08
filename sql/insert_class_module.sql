INSERT INTO class_module
(
	id,
	description,
	start_time,
	end_time,
	duration,
	vacancies,
	coach_id,
	category_id,
	monday,
	tuesday,
	wednesday,
	thursday,
	friday,
	saturday,
	sunday,
	box_id
)
VALUES
(
	nextval('class_module_sequence'),
	$1,		--description
	$2,		--start_time
	$3,		--end_time
	$4,		--duration
	$5,		--vacancies
	$6,		--coach_id
	$7,		--category_id
	$8,		--monday
	$9,		--tuesday
	$10,	--wednesday
	$11,	--thursday
	$12,	--friday
	$13,	--saturday
	$14,	--sunday
	$15		--box_id
)
RETURNING id