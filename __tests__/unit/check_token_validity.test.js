const jwt = require('jsonwebtoken');
const checkTokenValidity = require('../../helpers/check_token_validity');

describe('checkTokenValidity Function Tests', () => {
    it('should return false when token is not provided', async () => {
        const result = await checkTokenValidity(null);
        expect(result).toBe(false);
    });

    it('should return false for an invalid token', async () => {
        // Create an invalid token by signing with a different secret
        const invalidToken = jwt.sign({ user: 'testuser' }, 'invalid_secret', { expiresIn: '1h' });
        const result = await checkTokenValidity(invalidToken);
        expect(result).toBe(false);
    });

    it('should return decoded data for a valid token', async () => {
        const validToken = jwt.sign({ user: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const result = await checkTokenValidity(validToken);
        expect(result).toEqual({ user: 'testuser', iat: expect.any(Number), exp: expect.any(Number) });
    });
});
