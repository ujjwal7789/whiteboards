CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    data TEXT
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);