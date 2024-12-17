package com.moldyescape.moldyescape.chat;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/chat")
public class ChatController {

    ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    //
    // PETICIONES GET
    //

    @GetMapping()
    public List<String> getMethodName() {
        return chatService.getChat();
    }

    //
    // PETICIONES POST
    //

    @PostMapping("/envio")
    public ResponseEntity<Boolean> postMethodName(@RequestHeader("username") String user, @RequestBody String message) {
        chatService.addMessage(user, message);
        return ResponseEntity.ok(true);
    }

}
