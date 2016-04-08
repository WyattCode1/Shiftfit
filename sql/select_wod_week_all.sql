SELECT ww.publish_date, ww.name, c.name as category, ww.id as id
FROM wod_week ww
LEFT JOIN category c on c.id=ww.category_box_id
WHERE ww.box_id=$1
ORDER BY ww.publish_date