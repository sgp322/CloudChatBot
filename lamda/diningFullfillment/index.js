var AWS = require('aws-sdk');
var sqs = new AWS.SQS();
exports.handler = async (event) => {
    // TODO implement
    console.log(event.currentIntent.slots);
    
    var response = {
      "dialogAction":  {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText"
        }
      }
    };
    
    var params = {
     DelaySeconds: 10,
     MessageBody: JSON.stringify(event.currentIntent.slots),
     QueueUrl: "https://sqs.us-east-1.amazonaws.com/119190009335/DinningRequest"
    };
    
    return await sqs.sendMessage(params)
    .promise()
    .then(data => {
        console.log(response.dialogAction.message);
        response.dialogAction.message.content = "You’re all set. Expect my recommendations shortly! Have a good day.";
        return response;
    })
    .catch(error => {
        response.dialogAction.message.content = "Please Try again";
        console.log(error);
        return response;
    });
    
   
};
