IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'bookarchive')
BEGIN
    CREATE DATABASE bookarchive;
END

USE bookarchive

CREATE TABLE USERS (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    phone_number NVARCHAR(15),
    user_photo TEXT,
    created_at DATETIME DEFAULT GETDATE()
);


CREATE TABLE PASSWORDS (
    password_id INT IDENTITY(1,1) PRIMARY KEY,
    password_hash NVARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE TABLE FRIENDSHIPS (
    friendship_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id1 INT NOT NULL,
    user_id2 INT NOT NULL,
    FOREIGN KEY (user_id1) REFERENCES USERS(user_id),
    FOREIGN KEY (user_id2) REFERENCES USERS(user_id)
);

CREATE TABLE BOOKS (
    book_id INT IDENTITY(1,1) PRIMARY KEY,
    book_name NVARCHAR(255) NOT NULL,
    book_photo TEXT,
    section NVARCHAR(100),
    category NVARCHAR(100),
    shelf_number INT,
    row_number INT,
	author NVARCHAR(100),
	page_count INT,
	publisher_id INT
);


CREATE TABLE NOTES (
    note_id INT IDENTITY(1,1) PRIMARY KEY,
    book_id INT NOT NULL,
    publisher_id INT NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    sharing CHAR(1) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES BOOKS(book_id),
    FOREIGN KEY (publisher_id) REFERENCES USERS(user_id)
);

CREATE TABLE LOG (
    log_id INT IDENTITY(1,1) PRIMARY KEY, 
    log_message NVARCHAR(MAX) NOT NULL,   
    log_screen NVARCHAR(255),             
    log_file NVARCHAR(255),               
    has_error VARCHAR(1) NOT NULL,        
    log_date DATETIME DEFAULT GETDATE()   
);




INSERT INTO USERS (first_name, last_name, email, phone_number, user_photo, created_at)
VALUES 
('John', 'Doe', 'john.doe@example.com', '555-1234', 'http://example.com/photos/john_doe.jpg', GETDATE()),
('Jane', 'Smith', 'jane.smith@example.com', '555-5678', 'http://example.com/photos/jane_smith.jpg', GETDATE()),
('Alice', 'Johnson', 'alice.johnson@example.com', '555-8765', 'http://example.com/photos/alice_johnson.jpg', GETDATE()),
('Bob', 'Brown', 'bob.brown@example.com', '555-4321', 'http://example.com/photos/bob_brown.jpg', GETDATE());


INSERT INTO PASSWORDS (password_hash, user_id)
VALUES 
('$2b$10$4haI1M/QRjMw6Gx//ZHymOeMIQuffXHZ7S5rIydBm.Kf6xQc8.ppC', 1),
('$2b$10$kbSQs9DS48q45EGNSEn3o.oUfCkTltHEaex7FGsMtuEqdqgDSTQG6', 2),
('$2b$10$fjjzpIi/GXpAAcksTq5FMuCsb1wz1DIOvzg30xcANsmY9MBrjlWSa', 3),
('$2b$10$4VvKNKUBtrsKAYsK.oZTKO0564AmgYIY3rz77dHyuCfJuoafMTLxO', 4);

INSERT INTO FRIENDSHIPS (user_id1, user_id2)
VALUES 
(1, 2),
(2, 3),
(3, 4),
(4, 1),
(1, 3);


INSERT INTO BOOKS (book_name, book_photo, section, category, shelf_number, row_number, author, page_count, publisher_id)
VALUES 
('The Great Gatsby', 'http://example.com/photos/great_gatsby.jpg', 'Fiction', 'Classic', 1, 1, 'F. Scott Fitzgerald', 218, 1),
('To Kill a Mockingbird', 'http://example.com/photos/to_kill_a_mockingbird.jpg', 'Fiction', 'Classic', 1, 2, 'Harper Lee', 281, 2),
('1984', 'http://example.com/photos/1984.jpg', 'Fiction', 'Dystopian', 2, 1, 'George Orwell', 328, 3),
('Pride and Prejudice', 'http://example.com/photos/pride_and_prejudice.jpg', 'Fiction', 'Romance', 2, 2, 'Jane Austen', 279, 4);


INSERT INTO NOTES (book_id, publisher_id, content, sharing)
VALUES 
(1, 1, 'This is a note for The Great Gatsby', '0'),
(2, 2, 'This is a note for To Kill a Mockingbird', '1'),
(3, 3, 'This is a note for 1984', '2'),
(4, 4, 'This is a note for Pride and Prejudice', '0');


INSERT INTO LOG (log_message, log_screen, log_file, has_error, log_date)
VALUES 
('User logged in successfully', 'login_screen', 'auth.log', '0', GETDATE()),
('Failed to retrieve book details', 'book_screen', 'books.log', '1', GETDATE()),
('User created a new note', 'notes_screen', 'notes.log', '0', GETDATE()),
('Friendship request sent', 'friends_screen', 'friends.log', '0', GETDATE());
