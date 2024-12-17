package com.moldyescape.moldyescape.chat;

import java.util.ArrayList;
import java.util.List;

public class Chat {
    private List<String> chat = new ArrayList<>();

    public void addMessage(String message) {
        chat.add(message);
    }

    public List<String> getChat() {
        return this.chat;
    }
}
