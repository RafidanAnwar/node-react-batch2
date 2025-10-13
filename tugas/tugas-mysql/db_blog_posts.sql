CREATE DATABASE IF NOT EXISTS db_blog_posts;

USE db_blog_posts;

CREATE TABLE USERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE CATEGORIES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE BLOG_POSTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES USERS(id) ON DELETE SET NULL
);

CREATE TABLE POST_CATEGORIES (
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES BLOG_POSTS(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(id) ON DELETE CASCADE
);

-- Mengisi data ke dalam tabel USERS
INSERT INTO USERS (id, name) VALUES
(1, 'John Doe'),
(2, 'Robert'),
(3, 'Frank'),
(4, 'Jane');

-- Mengisi data ke dalam tabel CATEGORIES
INSERT INTO CATEGORIES (id, name) VALUES
(1, 'Basic'),
(2, 'Library'),
(3, 'Unknown'),
(4, 'Sport');

-- Mengisi data ke dalam tabel BLOG_POSTS
INSERT INTO BLOG_POSTS (id, title, body, author_id) VALUES
(1, 'Algorithm', 'this is article for algorithm', 1),
(2, 'Lorem Ipsum', 'lorem ipsum dolor sit amet', 1),
(3, 'NodeJS', 'Node.js is a JavaScript runtime built on Chrome''s V8 JavaScript engine.', 2),
(4, 'ReactJS', 'ReactJS is JavaScript library for building user interfaces', 4),
(5, 'Git', 'Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency', 3),
(6, 'Basketball', 'Basketball is a team sport in which two teams, most commonly of five players each, opposing one another on a rectangular court, compete with the primary objective of shooting a basketball (approximately 9.4 inches (24 cm) in diameter) through the defender''s hoop (a basket 18 inches (46 cm) in diameter mounted 10 feet (3.048 m) high to a backboard at each end of the court, while preventing the opposing team from shooting through their own hoop', 2);

-- Mengisi data ke dalam tabel POST_CATEGORIES (tabel relasi)
INSERT INTO POST_CATEGORIES (post_id, category_id) VALUES
(1, 1),
(2, 3),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(5, 1),
(6, 4);

# Query 1 tampilkan seluruh data post yang di tulis oleh john doe
SELECT
    bp.*
FROM
    BLOG_POSTS bp
JOIN
    USERS u ON bp.author_id = u.id
WHERE
    u.name = 'John Doe';
    
# Query 2: Tampilkan category name, post title, author name yang memiliki category basic saja
SELECT
    c.name AS category_name,
    bp.title AS post_title,
    u.name AS author_name
FROM
    BLOG_POSTS bp
JOIN
    USERS u ON bp.author_id = u.id
JOIN
    POST_CATEGORIES pc ON bp.id = pc.post_id
JOIN
    CATEGORIES c ON pc.category_id = c.id
WHERE
    c.name = 'Basic';
    
# Query 3: Tampilkan category name, post title, dan body yang ditulis oleh Robert dan Frank
SELECT
    c.name AS category_name,
    bp.title AS post_title,
    bp.body,
    u.name AS author_name
FROM
    BLOG_POSTS bp
JOIN
    USERS u ON bp.author_id = u.id
LEFT JOIN
    POST_CATEGORIES pc ON bp.id = pc.post_id
LEFT JOIN
    CATEGORIES c ON pc.category_id = c.id
WHERE
    u.name IN ('Robert', 'Frank');
    
# Query 4: Tampilkan nama penulis dan nama category untuk artikel yang memiliki lebih dari atau sama dengan dua category
SELECT
    u.name AS author_name,
    GROUP_CONCAT(c.name SEPARATOR ', ') AS categories
FROM
    USERS u
JOIN
    BLOG_POSTS bp ON u.id = bp.author_id
JOIN
    POST_CATEGORIES pc ON bp.id = pc.post_id
JOIN
    CATEGORIES c ON pc.category_id = c.id
GROUP BY
    bp.id, u.name
HAVING
    COUNT(pc.category_id) >= 2;
    
# Query 5: Tampilkan nama penulis dan pos title untuk artikel yang memilik hanya 1 category saja
SELECT
    u.name AS author_name,
    bp.title AS post_title
FROM
    BLOG_POSTS bp
JOIN
    USERS u ON bp.author_id = u.id
JOIN
    POST_CATEGORIES pc ON bp.id = pc.post_id
GROUP BY
    bp.id, u.name, bp.title
HAVING
    COUNT(pc.category_id) = 1;