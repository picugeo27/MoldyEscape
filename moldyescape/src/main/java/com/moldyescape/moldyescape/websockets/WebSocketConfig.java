package com.moldyescape.moldyescape.websockets;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Aquí definimos el canal /game, asi le ponesmos una url que no hemos usado
        // (rezo para no tener problemas con la api rest)
        registry.addHandler(new GameWebSocketHandler(), "/game")
                .setAllowedOrigins("*"); // Permite conexiones desde cualquier origen
    }
}
