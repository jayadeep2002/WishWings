const axios = require('axios');

async function testFeedback() {
    try {
        console.log('Testing Feedback Submission...');
        const res = await axios.post('http://localhost:5000/api/feedback', {
            name: 'Test User',
            email: 'test@example.com',
            rating: 5,
            category: 'Service',
            message: 'This is a test feedback message.'
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testFeedback();
