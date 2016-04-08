SELECT id as id, name as name_category
FROM category
WHERE box_id=$1
ORDER BY name;