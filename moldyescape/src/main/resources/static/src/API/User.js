
function keepAlive() {
    if (connectedUser.username != null) {
        // Realiza una solicitud AJAX para mantener la conexión activa
        $.ajax({
            method: "POST",
            url: "/users/keepalive/" + connectedUser.username,

        })
            .done(function (data, textStatus, jqXHR) {
                console.log("Keepalive success: " + textStatus + " " + jqXHR.status);
            })
            .fail(function () {
                console.error("Keepalive error");

                alert("Se ha detectado una desconexion. Seras desconectado en breve.");

                // Esperar unos segundos y desconectar al usuario
                setTimeout(function () {
                    alert("Has sido desconectado del juego.");
                    connectedUser.logOut();

                    console.log("Usuario desconectado automaticamente.");
                }, 5000); // Espera 5 segundos antes de desconectar
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





