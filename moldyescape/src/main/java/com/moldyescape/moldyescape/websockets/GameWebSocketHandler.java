package com.moldyescape.moldyescape.websockets;

import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;

import java.io.IOException;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

public class GameWebSocketHandler extends TextWebSocketHandler {

    private ConcurrentHashMap<String, Lobby> lobbys = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        String roomId = assignRoom(session);
        session.sendMessage(new TextMessage("Asignado al lobby " + roomId));
        System.out.println("Nuevo jugador conectado: " + session.getId());
    }

    public String assignRoom(WebSocketSession session) {
        for (Map.Entry<String, Lobby> entry : lobbys.entrySet()) {
            if (!entry.getValue().isFull()) {
                lobbys.put(session.getId(), entry.getValue());
                entry.getValue().addPlayer(session);
                return entry.getValue().getName();
            }
        }

        lobbys.put(session.getId(), new Lobby(session.getId(), session));
        return session.getId();

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Mensaje recibido: " + message.getPayload());

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());

        String type = jsonNode.get("type").asText();

        if (!type.equalsIgnoreCase("vote")) {
            sendMessageToLobby(session.getId(), message.getPayload());
        } else if (type.equalsIgnoreCase("vote")) {
            mannageVotes(jsonNode, session);
        }

    }

    private void sendMessageToLobby(String lobby, String message) throws IOException {
        System.out.println(lobbys.get(lobby));
        for (WebSocketSession session : lobbys.get(lobby).getConnectedUsers()) {
            session.sendMessage(new TextMessage(message));
        }

    }

    private void sendStartMessage(String lobby) throws IOException {
        System.out.println("send start message");
        lobbys.get(lobby).startPlaying();

        Random rand = new Random();
        int number = rand.nextInt(2);
        int map = lobbys.get(lobby).getRandomVote();

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode message = objectMapper.createObjectNode();
        message.put("type", "start");
        message.put("value", map);
        message.put("role", number);

        ObjectNode message1 = objectMapper.createObjectNode();
        message1.put("type", "start");
        message1.put("value", map);
        message1.put("role", 1 - number);

        lobbys.get(lobby).getConnectedUsers().get(0)
                .sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        lobbys.get(lobby).getConnectedUsers().get(1)
                .sendMessage(new TextMessage(objectMapper.writeValueAsString(message1)));
    }

    private void mannageVotes(JsonNode jsonNode, WebSocketSession session) throws IOException {
        if (jsonNode.get("vote").asText().equals("-1"))
            lobbys.get(session.getId()).removeVote();
        else {
            lobbys.get(session.getId()).vote(jsonNode.get("vote").asInt());
            if (lobbys.get(session.getId()).isReadyToStart()) {
                sendStartMessage(session.getId());
            }
        }

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws JsonProcessingException, IOException {
        removePlayer(session);
        System.out.println("Jugador desconectado: " + session.getId());
    }

    public void removePlayer(WebSocketSession session) throws JsonProcessingException, IOException {
        Lobby value = lobbys.get(session.getId());
        value.removePlayer(session);

        if (!value.getConnectedUsers().isEmpty())
            informDisconnection(value);

        lobbys.remove(session.getId());
        System.out.println(lobbys);
    }

    public void informDisconnection(Lobby lobby) throws JsonProcessingException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode message = objectMapper.createObjectNode();
        message.put("type", "disconnect");

        lobby.getConnectedUsers().get(0).sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
    }

}
