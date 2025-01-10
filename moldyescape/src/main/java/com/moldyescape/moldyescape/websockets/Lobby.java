package com.moldyescape.moldyescape.websockets;

import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.web.socket.WebSocketSession;

public class Lobby {
    final int MAXPLAYERS = 2;

    private String name;
    private int connectedPlayers;
    private ArrayList<Integer> votes = new ArrayList<>();
    private CopyOnWriteArrayList<WebSocketSession> players = new CopyOnWriteArrayList<>();
    private boolean playing;

    public Lobby(String name, WebSocketSession session) {
        this.name = name;
        this.playing = false;
        this.connectedPlayers = 1;
        players.add(session);
    }

    public void removePlayer(WebSocketSession session) {
        connectedPlayers -= 1;
        players.remove(session);
    }

    public void addPlayer(WebSocketSession session) {
        connectedPlayers += 1;
        players.add(session);
    }

    public CopyOnWriteArrayList<WebSocketSession> getConnectedUsers() {
        System.out.println(this.players);
        return this.players;
    }

    public boolean isFull() {
        return (this.connectedPlayers == MAXPLAYERS);
    }

    public boolean isEmpty() {
        return this.connectedPlayers == 0;
    }

    public boolean isReadyToStart() {
        return votes.size() == MAXPLAYERS;
    }

    public void startPlaying() {
        this.playing = true;
    }

    public void stopPlaying() {
        this.playing = false;
    }

    public boolean getPlaying() {
        return this.playing;
    }

    public String getName() {
        return this.name;
    }

    public void vote(int vote) {
        votes.add(vote);
    }

    public void removeVote() {
        if (!votes.isEmpty())
            votes.removeFirst();
    }

    public int getRandomVote() {
        Random rand = new Random();
        int random = rand.nextInt(votes.size());
        return votes.get(random);
    }
}
