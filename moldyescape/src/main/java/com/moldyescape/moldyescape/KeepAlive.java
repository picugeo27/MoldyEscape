package com.moldyescape.moldyescape;

import java.util.HashMap;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class KeepAlive { // usamos el constructor implicito (no lo definimos y va solo)

    // Creamos un set (una lista sin duplicados) y le asignamos "eso". "Eso" es una
    // manera de iniciar el Set
    // se puede iniciar con hashMap tambien (creo) pero veo que me recomiendan
    // hacerlo asi porque es mas seguro
    // trabajar con eso especialmente si hay varios hilos (no se si leeremos datos
    // simultaneos)
    private final Set<String> connectedUsers = ConcurrentHashMap.newKeySet();

    // usamos 2 variables, una para acceder a los usuarios rapido (el set de arriba)
    // y otra para gestionar cuando borrarlos
    // la segunda es la que guarda cuanto tiempo llevan sin mandar el keep alive
    private final HashMap<String, Long> lastActivity = new HashMap<>();

    // añadimos el username, pero si esta no lo añade (como es un set si aparece
    // repeticion no lo añade y tampoco da error)
    // despues actualizamos la ultima conexion del usuario, si es la primera vez se
    // añade
    public void keepAlive(String username) {
        connectedUsers.add(username);
        lastActivity.put(username, System.currentTimeMillis());
    }

    public void disconnectUser(String username) {
        connectedUsers.remove(username);
        lastActivity.remove(username);
    }

    @Scheduled(fixedRate = 5 * 1000) // cada 10 segundos
    public void removeInactive() {
        long currentTime = System.currentTimeMillis();
        long maxTime = 10 * 1000; // 1000 porque lo medimos en milisegundos, el otro numero lo puse para decir
                                  // cuantos segundos

        // hice algo raro. entery set elimina valores, el remove if lo elimina si dentro
        // hay true o false. La condicion esta dentro
        // porque comparamos los tiempos, y si lleva mas tiempo afk se elimina de los
        // usuarios conectados y se devuelve true, sino no se borra
        lastActivity.entrySet().removeIf(user -> {
            if (currentTime - user.getValue() > maxTime) {
                connectedUsers.remove(user.getKey());
                return true;
            }
            return false;
        });
    }

    // por si nos interesa devolvemos el numero o los usuarios
    public int getConnectedUsersCount() {
        return connectedUsers.size();
    }

    public Set<String> getConnectedUsers() {
        return connectedUsers;
    }
}
