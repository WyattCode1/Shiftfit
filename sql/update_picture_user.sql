UPDATE shift_picture SET picture_name=$2, picture_name=$3, picture_file=$4, last_update=current_timestamp Where id=$1 returning id;