var AWS = require('aws-sdk');
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
    
    response.dialogAction.message.content = "Hi, How Can I help You?";
    return response;
   
};
