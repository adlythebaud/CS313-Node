CREATE TABLE IF NOT EXISTS project_2.restaurants (
    place_id VARCHAR(50) constraint restaurants_pk PRIMARY KEY,
    name VARCHAR(30),
    formatted_address TEXT,
    health_score INT
);