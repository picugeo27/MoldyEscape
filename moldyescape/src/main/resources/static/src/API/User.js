
function keepAlive() {
    if (connectedUser.username != null) {
        // Realiza una solicitud AJAX para mantener la conexión activa
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/users/keepalive/" + connectedUser.username,

        })
            .done(function (data, textStatus, jqXHR) {
                console.log("Keepalive success: " + textStatus + " " + jqXHR.status);
            })
            .fail(function () {
                console.error("Keepalive error");
            });
    } else {
        console.log("No connected user. Keepalive not sent.");
    }
}

// el usuario conectado. Solo tiene los datos que quiero que tenga el cliente
var intervalo;
var connectedUser = {
    username: null,
    logged: false,

    // aqui le pondremos metodos que nos interesen

    logIn: function (username) {
        this.username = username;
        this.logged = true;

        intervalo = setInterval(keepAlive, 10 * 1000);

    },

    logOut: function () {
        this.username = null,
            this.logged = false;
        clearInterval(intervalo);
    }
}





