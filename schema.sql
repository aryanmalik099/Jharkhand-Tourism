CREATE DATABASE IF NOT EXISTS jharkhand
  DEFAULT CHARACTER SET utf8mb4;
USE jharkhand;

CREATE TABLE IF NOT EXISTS accounts (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS places (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    district VARCHAR(50),
    category VARCHAR(50),
    description TEXT,
    image_url VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vendors (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    image_url VARCHAR(255),
    description TEXT,
    contact VARCHAR(100),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS trips (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    trip_name VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS trip_places (
    trip_id INT NOT NULL,
    place_id INT NOT NULL,
    PRIMARY KEY (trip_id, place_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (place_id) REFERENCES places(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS saved_places (
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    PRIMARY KEY (user_id, place_id),
    FOREIGN KEY (user_id) REFERENCES accounts(id),
    FOREIGN KEY (place_id) REFERENCES places(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;