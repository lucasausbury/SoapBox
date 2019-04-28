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
        if( process.env.NETLIFY_BUILD_HOOK_URL ) {
            fetch(process.env.NETLIFY_BUILD_HOOK_URL, {
                method:'POST',
                body:""
            }).then(res => {
                callback(null, {
                    statusCode:200,
                    body:""
                });
            })
        } else console.log("NETLIFY BUILD HOOK URL IS MISSING");
    }
}