require("dotenv").load();
require("isomorphic-fetch");

exports.handler = function(event, context, callback) {
    const { headers, queryStringParameters } = event;

    if( queryStringParameters.challenge ) {
        callback(null, {
            statusCode:200,
            body:queryStringParameters.challenge,
            headers:{
                "Content-Type":"text/plain",
                "X-Content-Type-Options":"nosniff"
            }
        });
    } else if( headers["x-dropbox-signature"] ) {
        fetch(process.env.NETLIFY_BUILD_HOOK_URL, {
            method:'POST',
            body:""
        }).then(res => {
            callback(null, {
                statusCode:200,
                body:""
            });
        });
    }
}