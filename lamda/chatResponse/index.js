var AWS = require('aws-sdk');
var lexruntime = new AWS.LexRuntime();

exports.handler = async (event) => {
    console.log(event);
    let lastUserMessage = event.message;
    let botMessage = "I'm confused, hopefully I will be able to answer it in the next assignment.";
    if (lastUserMessage === 'hi' || lastUserMessage =='hello') {
        const hi = ['hi','howdy','hello'];
        botMessage = hi[Math.floor(Math.random()*(hi.length))];
    }
    
    if (lastUserMessage === 'name') {
        botMessage = 'I am root';
    }
    var params = {
      botAlias: '$LATEST',
      botName: 'Dining',
      inputText: lastUserMessage,
      userId: 'STRING_VALUE'
    };
    await lexruntime.postText(params)
    .promise()
    .then(data => {
        console.log('data',data); 
        if (data.message) {
            botMessage = data.message;
        }
    })
    .catch(error => {
        console.log('err', error);
    });
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(botMessage)
    };
    return response;
};