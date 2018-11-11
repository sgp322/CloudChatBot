const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const yelp = require('yelp-fusion');
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const phone = require('phone');
var sns = new AWS.SNS();
const client = yelp.client('63AeKOwvhglKoGe8vAA1plTCL05ywaJv5hDiimHQ9chiooUL1sdSgbpWCoMnatEz_idp-g3VbXDBBbpqQ4fnKAYwZV9QA5hqCzFXxvrSiYUHjJawFY5N6egojqfnW3Yx');

exports.handler = async (event) => {
    console.log(event);
    const queueURL = "https://sqs.us-east-1.amazonaws.com/119190009335/DinningRequest";
    var params = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0
    };
    var receipt, body,textString;
    await sqs.receiveMessage(params)
    .promise()
    .then(data=> {
        if (data.Messages && data.Messages[0]) {
            receipt = data.Messages[0].ReceiptHandle;
            body = data.Messages[0].Body;
            body = JSON.parse(body);
            var appointment = new Date(body.Date + " " + body.Time);
            var unixDate = Math.round(appointment.getTime() / 1000);
            console.log('body', body);
            return client.search({
                term:'restaurants',
                location: body.Location,
                limit: 3,
                open_at: unixDate,
                categories: body.cuisine
            });
        } else {
            throw ("No messages");
        }
    })
    .then(response => {
        var businessList = response.jsonBody;
        var count =1;
        textString = "Hello! Here are my " + body.cuisine + " restaurant suggestions for " + body.peoplenum +" people, for " + body.Date + " at " + body.Time + ". ";
        for (var business of businessList.businesses) {
            textString = textString + count + "." + business.name + ", located at " + business.location.address1 + " ";
            count++;
        }
        textString = textString + " Enjoy your meal!";
        console.log('textString',textString);
        var dynamoParams = {
            TableName: "DinningSuggestions",
            Item: {
                'id' : receipt + "" + (new Date).getTime(),
                'query' : {S : JSON.stringify(body)},
                'suggestions': {S :JSON.stringify(businessList.businesses)}
            },
        };
        return dynamo.putItem(dynamoParams).promise();
        
    })
    .then(data => {
        console.log('dymano sucess', data);
        console.log(phone(body.phone));
        var SNSparams = {
            Message: textString, /* required */
            PhoneNumber: phone(body.phone)[0],
        };
        return sns.publish(SNSparams).promise()
    })
    .then(data=> {
        console.log('SNS sucess ',data);
         var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: receipt
        };
        return sqs.deleteMessage(deleteParams).promise();
    })
    .then(data => {
        console.log('sqs message deleted ',data);
    })
    .catch(error => {
        console.log(error);
    });
};
