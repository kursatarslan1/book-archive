const request = require('supertest');
const app = require('../../index'); // Assuming your Express app is exported from index.js
const jwt = require('jsonwebtoken');

describe('Friendship Controller Tests', () => {
    // Mock JWT token for testing
    let mockToken = jwt.sign({ user: { user_id: 3 } }, process.env.JWT_SECRET);

    describe('POST /friendship', () => {
        it('should send a friend request', async () => {
            const requestBody = { user_id1: 3, user_id2: 4 }; // replace with actual friends ID
            const response = await request(app)
                .post('/bookarchive/friendship/friendship')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(requestBody);

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('Friend request sent successfully.');
        });

        it('should handle unauthorized token', async () => {
            const requestBody = { user_id1: 3, user_id2: 4 }; // replace with actual friends ID
            const response = await request(app)
                .post('/bookarchive/friendship/friendship')
                .send(requestBody);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid token.');
        });
    });

    describe('GET /friendship/:receiver_user_id', () => {
        it('should get friend requests', async () => {
            const receiverUserId = 3; // Replace with actual receiver user id
            const response = await request(app)
                .get(`/bookarchive/friendship/friendship/${receiverUserId}`)
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.requestResult).toBeDefined();
        });

        it('should handle unauthorized token', async () => {
            const receiverUserId = 4; // Replace with actual receiver user id
            const response = await request(app)
                .get(`/bookarchive/friendship/friendship/${receiverUserId}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid token.');
        });
    });
});
