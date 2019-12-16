/// <reference path="../lib/pnp/pnp.js" />
/// <reference path="../lib/pnp/fetch.js" />



//Enter key pressed on query
//make the call to LUIS using the query text to determine intent
function QueryTextEnter() {
    var queryText = jQuery("#QueryText").val();

    ////if we aren't in teams, return
    //if (!_microsoftTeamsContext) {
    //    PostResponse("<h1>The use of this bot is restricted to Teams.</h1>");
    //    return;
    //}

    PostQuestion(queryText);

    //web serivce call to LUIS passying the 
    //query as a query string parameter
    var call = jQuery.ajax({
        url: "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/967b481c-54e7-4484-ad88-03818c93e223?verbose=true&timezoneOffset=0&subscription-key=66151f614d21469890ddf04fdc408dc9&q=" + queryText,
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    call.done(function (data, textStatus, jqXHR) {
        console.log(data);
        //get the intent and the score that LUIS thinks
        //is the top scoring intent
        var intent = data.topScoringIntent.intent;
        var searchTerm = '';
        if (intent === 'SearchForDocument') {
            for (var i = 0; i < data.entities.length; i++) {
                var thisEntity = data.entities[i];
                if (thisEntity.type === 'SearchTerm') {
                    searchTerm = thisEntity.entity;
                    break;
                }
            }
            if (data.entities.length > 0) {
                console.log("entity:", data.entities[0]);
            }
        }
        if (searchTerm !== '') {
            // send to logic app
            var lappCall = jQuery.ajax({
                url: "https://prod-16.centralus.logic.azure.com:443/workflows/6420a9a03f9b488a9df5a91487b0e3ed/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hPgg-RjwE-LoFOKrwrUR6Ssldtt9tAFEJdUf-9ZyZVM",
                type: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                data: '{ "searchTerm": "'+searchTerm+'" }'
            });

            lappCall.done(function (data, textStatus, jqXHR) {
                console.log("logic app response", data);
                var spBody = parseSharepointResult(data);
                console.log('parsed sp body', spBody);
                var chatResponse = prepareSearchResponse(spBody, searchTerm);
                PostResponse(chatResponse);
            });
            lappCall.fail(function (e, textStatus, errorThrown) {
                console.log("error calling logic app", e);
            });
        }
        console.log("intent:", intent);
        console.log("data", data);

        
    });
    call.fail(function (jqXHR, textStatus, errorThrown) {
        alert("Fail");
    });

}

function PostQuestion(question) {
    $("#response").prepend("<div class='question'>" + question + "</div>");
}

function PostResponse(response) {
    
    $("#response").prepend("<div class='response'><div class='message'>" + response + "</div><div class='hillbilly'><img height='50' src='/images/noun_Chatbot.svg'></div></div>");
}

//execute the Logic App that queries the SharePoint List
//to get the response text based on the intent keyword
//return from LUIS
function GetFAQ(keyword) {
    //var defer = $.Deferred();
    //var call = jQuery.ajax({
    //    url: "<Logic App End Point>",
    //    type: "POST",
    //    data: JSON.stringify({
    //        "intent": keyword
    //    }),
    //    headers: {
    //        "Content-Type": "application/json"
    //    }
    //});
    //call.done(function (data, textStatus, jqXHR) {
    //    console.log(data);
    //    defer.resolve(data.value[0].FAQ);
    //});
    //call.fail(function (jqXHR, textStatus, errorThrown) {
    //    alert("Cannot retrieve response. Please try again.");
    //    defer.resolve();
    //});
    //return defer.promise();
}

function prepareSearchResponse(spBody, searchTerm) {
    var chatResponse = 'I searched for "' + searchTerm + '" and found ' + spBody.results.length + " responses. Here are the top 5:<br/>";
    for (var i = 0; i < Math.min(5, spBody.results.length); i++) {
        var thisLine = 'Title: ' + spBody.results[i].Title + ' <br/>  \
        Url: <a href='+ spBody.results[i].Path + '>' + spBody.results[i].Path +'</a><br/><br/>';
        chatResponse += thisLine;
    }
    return chatResponse;

}