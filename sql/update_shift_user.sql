UPDATE shiftfit_user set first_name = $2, last_name=$3, email=$4, location=$5, city=$6, state=$7, phone=$8, user_name=$9, birthdate=$10 WHERE id = $1 returning id;