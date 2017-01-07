(function() {

    var chat = {

        joinToChat: function(e) {
            var nick = this.nick.value;

            if (nick !== "") {
                this.sendData({
                    type: 'join',
                    nick: nick
                });
            }

            e.target.onclick = null;
            e.target.setAttribute('disabled', 'disabled');
            this.nick.setAttribute('readonly', 'readonly');

            this.btnSend.removeAttribute('disabled');
            this.btnSend.onclick = this.sendMessage.bind(this);

        },

        sendData: function(message) {
            var data = JSON.stringify(message);
            this.socket.send(data);
        },

        sendMessage: function() {
            var message = this.message.value;

            if (message !== "") {
                this.sendData({
                    type: "message",
                    message: message
                });

                this.message.value = "";
            }
        },

        displayMessage: function(e) {
            var obj = JSON.parse(e.data);
            this.renderView(obj);
        },

        renderView: function(obj) {

            var row = document.createElement("div");
            var date = new Date();
            var time = date.getHours() + ':' + date.getMinutes();
            var message;

            row.classList.add("row");

            if (obj.type == "status")
                message = "<p><i>" + obj.message + "</i></p>";
            else
                message = "<p><strong>" + obj.name + "</strong> " + obj.message + "</p>";

            row.innerHTML = "<p>" + time + "</p>" + message;

            this.chat.appendChild(row);
            this.chat.scrollTop = this.chat.scrollHeight;

        },

        stop: function() {

            this.btnJoin.onclick = null;
            this.btnJoin.setAttribute("disabled", "disabled");

            this.btnSend.onclick = null;
            this.btnSend.setAttribute("disabled", "disabled");

            this.renderView({
                type: "status",
                message: "Przerwano połączenie z serwerem."
            });

        },

        connectToServer: function() {

            this.socket = new WebSocket("ws://localhost:8080");
            this.socket.onmessage = this.displayMessage.bind(this);
            this.socket.onclose = this.stop.bind(this);

        },


        init: function() {
            if (!window.WebSocket) return false;

            this.nick = document.querySelector('#inputNick');
            this.btnJoin = document.querySelector('#btnJoin');
            this.message = document.querySelector('#inputMessage');
            this.btnSend = document.querySelector('#btnSendMessage');
            this.chat = document.querySelector('#chat-window');

            this.btnJoin.onclick = this.joinToChat.bind(this);
            this.connectToServer();

        }
    }

    chat.init();

})();
