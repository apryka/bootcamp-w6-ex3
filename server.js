var ws = require("nodejs-websocket");

var server = ws.createServer(function(connection) {

    connection.on("text", function(data) {

        var dataObject = JSON.parse(data);

        if(dataObject.type == "join") {
            connection.nick = dataObject.nick;

            sendToAll({
                type: "status",
                message: connection.nick + " dołączył/a do czatu."
            });
        } else if(dataObject.type == "message") {
            sendToAll({
                type: "message",
                name: connection.nick,
                message: dataObject.message
            });
        }

    });

    connection.on("close", function() {

        if(connection.nick) {
            sendToAll({
                type: "status",
                message: connection.nick + " opuścił/a czat."
            });
        }

    });

    connection.on("error", function(e) {
        console.log("Nieoczekiwanie przerwano połączenie!");
    });

}).listen(8080, "localhost", function() {
    console.log("Serwer aktywny!");
});

function sendToAll(data) {

    var msg = JSON.stringify(data);

    server.connections.forEach(function(connection) {
        connection.sendText(msg);
    });

}
