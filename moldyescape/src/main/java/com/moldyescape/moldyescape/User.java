package com.moldyescape.moldyescape;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
    private String username;
    private String password;
    private long lastSeen;

    /*
     * {"username": kk,
     * "password": pass123,
     * "lastSeen": 123456789}
     */

    @JsonCreator
    public User(@JsonProperty("username") String username,
                @JsonProperty("password") String password,
                @JsonProperty("lastSeen") long seen)
                {
                    this.username = username;   // el this.es el campo de json
                    this.password = password;   // lo que hay a la derecha es la variable
                    this.lastSeen = seen;
                }
    
    public User(String username, String password){
        this(username, password, System.currentTimeMillis());
    }

    public String getUsername(){
        return this.username;
    }
}
