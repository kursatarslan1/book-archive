// book_controller.test.js

const request = require('supertest');
const app = require('../../index');

describe('Book Controller Tests', () => {
  let authToken;
  let createdBookId;

  beforeAll(async () => {
    // Mock a login request to get the auth token
    const loginResponse = await request(app)
      .post('/bookarchive/users/login')
      .send({
        email: 'krs.arslan3@gmail.com', // Replace with your test user's email
        password: 'kursat.123' // Replace with your test user's password
      });
    
    authToken = loginResponse.body.token;
  });

  it('should create a new book', async () => {
    const newBook = {
      book: {
        book_name: 'Integration Test Book',
        author: 'Test Author',
        publisher_id: 1, 
        book_photo: [{ base64: 'base64string', path: 'testpath' }] 
      }
    };

    const response = await request(app)
      .post('/bookarchive/books/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBook);
    expect(response.status).toBe(200);
    
    expect(response.body.message).toContain('Book created successfully');
    expect(response.body.bookResult).toHaveProperty('book_id');

    createdBookId = response.body.bookResult.book_id;
  });

  it('should get a book by ID', async () => {
    const bookId = 9; 

    const response = await request(app)
      .get(`/bookarchive/books/book/${bookId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.bookResult).toBeDefined();
    expect(response.body.bookResult.book_id).toBe(bookId);
  });

  it('should update a book', async () => {
    const updatedBook = {
      book: {
        book_id: createdBookId,
        book_name: 'Updated Integration Test Book',
        author: 'Updated Test Author',
        publisher_id: 3,
        book_photo: ""
      }
    };

    const response = await request(app)
      .put('/bookarchive/books/book')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedBook);

    expect(response.status).toBe(200);
    expect(response.body.bookResult).toBeDefined();
    expect(response.body.bookResult.book_id).toBe(createdBookId);
  });

  it('should delete a book', async () => {
    const response = await request(app)
      .delete(`/bookarchive/books/book/${createdBookId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Book deleted successfully');
  });


});

