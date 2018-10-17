exports.handler = async (event) => {
    console.log(event.message);
    let lastUserMessage = event.message;
    let botMessage = "I'm confused, hopefully I will be able to answer it in the next assignment.";
    if (lastUserMessage === 'hi' || lastUserMessage =='hello') {
        const hi = ['hi','howdy','hello'];
        botMessage = hi[Math.floor(Math.random()*(hi.length))];
    }
    
    if (lastUserMessage === 'name') {
        botMessage = 'I am root';
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(botMessage)
    };
    return response;
};