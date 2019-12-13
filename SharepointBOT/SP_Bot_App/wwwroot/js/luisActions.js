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
        if (data.entities.length > 0) {
            console.log("entity:", data.entities[0]);
        }
        console.log("intent:", intent);
        console.log("data",data);
    });
    call.fail(function (jqXHR, textStatus, errorThrown) {
        alert("Fail");
    });

}

function PostQuestion(question) {
    $("#response").prepend("<div class='question'>" + question + "</div>");
}

function PostResponse(response) {
    $("#response").prepend("<div class='response'><div class='message'>" + response + "</div><div class='hillbilly'><img height='50' src='https://www.markrackley.net/wp-content/uploads/2019/02/hillbilly.png'></div></div>");
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