
const app = require('./index');

const mockListen = () => {
    console.log('Mock server running on port 3001');
    return Promise.resolve();
};

global.testServer = {
    listen: mockListen
};
