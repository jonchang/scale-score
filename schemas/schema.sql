-- sqlfluff:dialect:sqlite

DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS ratings;

CREATE TABLE IF NOT EXISTS images (
    idx INTEGER PRIMARY KEY AUTOINCREMENT,
    basename TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    basename TEXT NOT NULL,
    rater TEXT NOT NULL,
    rating INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_ratings_basename ON ratings (basename);
