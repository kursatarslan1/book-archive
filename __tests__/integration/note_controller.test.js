// note_controller.test.js

const request = require('supertest');
const app = require('../../index');

describe('Note Controller Tests', () => {
    let authToken;

    beforeAll((done) => {
        // Simulate user login to get JWT token for authorization
        const userCredentials = {
            email: 'krs.arslan3@gmail.com',
            password: 'kursat.123'
        };

        request(app)
            .post('/bookarchive/users/login')
            .send(userCredentials)
            .end((err, response) => {
                authToken = response.body.token; // Save the JWT token
                done();
            });
    });

    // afterAll(async () => {
    //     await Note.destroy({ where: {}, force: true });
    //     await Log.destroy({ where: {}, force: true });
    // });

    it('should create a new note', async () => {
        const newNote = {
            note: {
                content: 'Sample note content',
                book_id: 9,
                sharing: 'P'
            }
        };

        const res = await request(app)
            .post('/bookarchive/notes/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newNote);

        note_id = newNote.note_id;

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Note created successfully');
        expect(res.body.noteResult).toHaveProperty('note_id');
        expect(res.body.noteResult.publisher_id).toBeDefined();
    });

    it('should get notes by book ID', async () => {
        const bookId = 9;

        const res = await request(app)
            .get(`/bookarchive/notes/note/${bookId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.notesResult).toBeDefined();
        expect(res.body.notesResult.length).toBeGreaterThanOrEqual(0);
    });

    it('should update a note', async () => {
        // First, create a note to update
        const newNote = {
            note: {
                content: 'Note to update',
                book_id: 9,
                sharing: 'P',
            }
        };

        let res = await request(app)
            .post('/bookarchive/notes/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newNote);

        const noteToUpdate = res.body.noteResult;

        // Update the note
        const updatedNote = {
            note: {
                note_id: noteToUpdate.note_id,
                content: 'Updated note content',
                publisher_id: noteToUpdate.publisher_id,
                book_id: noteToUpdate.book_id,
                sharing: noteToUpdate.sharing,
            }
        };

        res = await request(app)
            .put('/bookarchive/notes/note')
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedNote);

        expect(res.statusCode).toEqual(200);
        expect(res.body.noteResult).toBeDefined();
        expect(res.body.noteResult.note_id).toEqual(noteToUpdate.note_id);
        expect(res.body.noteResult.content).toEqual('Updated note content');
    });

    it('should delete a note', async () => {
        const newNote = {
            note: {
                content: 'Note to delete',
                book_id: 9,
                sharing: 'P',
            }
        };

        let res = await request(app)
            .post('/bookarchive/notes/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newNote);

        const noteToDelete = res.body.noteResult;

        res = await request(app)
            .delete(`/bookarchive/notes/note/${noteToDelete.note_id}/${noteToDelete.publisher_id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Note deleted successfully');
    });
});

