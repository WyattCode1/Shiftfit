DROP TABLE IF EXISTS shiftfit_user;

CREATE TABLE shiftfit_user (
    id          integer PRIMARY KEY,
    email       varchar(100) NOT NULL,
    user_name   varchar(100),
    first_name  varchar(100),
    password    varchar(255),
    last_name   varchar(100)
);