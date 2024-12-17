package com.moldyescape.moldyescape.chat;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ChatService {
    Chat chat = new Chat();

    public List<String> getChat() {
        return chat.getChat();
    }

    public void addMessage(String user, String message) {
        String aux = user + ": " + message;
        chat.addMessage(aux);
    }

}
