INSERT INTO wod_week (id, name, publish_date, wod_text, category_box_id, public_wod, box_id) 
VALUES (nextval('wod_week_sequence'), $1, $2, $3, $4, $5, $6) RETURNING id;
