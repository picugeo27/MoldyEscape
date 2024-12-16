package com.moldyescape.moldyescape;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
    private String username;
    private String password;
    private int matchesWon;

    /*
     * {"username": kk,
     * "password": pass123,
     * "lastSeen": 123456789}
     */
    @JsonCreator
    public User(@JsonProperty("username") String username,
                @JsonProperty("password") String password)
                {
                    this.username = username;   // el this.es el campo de json
                    this.password = password;   // lo que hay a la derecha es la variable
                    matchesWon = 0;
                }

    public String getUsername(){
        return this.username;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public String getPassword(){
        return this.password;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public int getMatchesWon(){
        return this.matchesWon;
    }

    public void setMatchesWon(int matches){
        this.matchesWon = matches;
    }

    public void addWin(){
        this.matchesWon++;
    }
}
