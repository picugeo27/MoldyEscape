// el usuario conectado. Solo tiene los datos que quiero que tenga el cliente

var connectedUser = {
    username: null,
    logged : false,

    // aqui le pondremos metodos que nos interesen

    logIn: function(username){
        this.username = username;
        this.logged = true;
    },

    logOut: function(){
        this.username = null,
        this.logged = false;
    }
}

function setInterval(){}

function keepAlive(){
    if (connectedUser.username != null){
        
        
    }
}