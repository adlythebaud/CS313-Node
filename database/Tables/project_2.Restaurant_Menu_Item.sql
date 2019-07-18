CREATE TABLE IF NOT EXISTS project_2.restaurant_menu_items (
    item_id SERIAL CONSTRAINT item_id_pk PRIMARY KEY,
    name VARCHAR(50),
    place_id VARCHAR(50) CONSTRAINT restaurant_menu_items_restaurant_place_id_fk REFERENCES project_2.restaurant(place_id),
    health_score INT
);