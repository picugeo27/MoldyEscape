package com.moldyescape.moldyescape;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class Ranking {

    Map<String, Integer> ranking = new LinkedHashMap<>();
    List<Map.Entry<String, Integer>> list = new ArrayList<>(ranking.entrySet());
    Map<String, Integer> sortedMap = new LinkedHashMap<>();

    public Ranking() {

        list.sort(Map.Entry.comparingByValue());

        for (Map.Entry<String, Integer> entry : list) {
            sortedMap.put(entry.getKey(), entry.getValue());
        }
    }

    public void deleteUser(String who) {
        ranking.remove(who);
    }

    public List<String> getTopUsers() {
        List<String> topUsers = new ArrayList<>();
        Iterator<String> iterator = ranking.keySet().iterator();
        for (int i = 0; i < 5; i++) {
            if (iterator.hasNext())
                topUsers.add(iterator.next());
            else
                break;
        }
        return topUsers;
    }

    public int getUserWins(String username) {
        return ranking.get(username);
    }

    public void addWin(String who) {
        ranking.put(who, ranking.get(who) + 1);
        orderRanking();
    }

    public void addUser(String key, Integer value) {
        // metemos la info en el ranking
        ranking.put(key, value);
        orderRanking();
    }

    public void addUser(User user) {
        ranking.put(user.getUsername(), user.getMatchesWon());
        orderRanking();

    }

    public void orderRanking() {
        List<Map.Entry<String, Integer>> list = new ArrayList<>(ranking.entrySet());
        list.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

        // volcamos la lista ordenada en un nuevo hashmap
        Map<String, Integer> sortedMap = new LinkedHashMap<>();
        for (Map.Entry<String, Integer> entry : list) {
            sortedMap.put(entry.getKey(), entry.getValue());
        }

        // Actualizar el ranking con el mapa ordenado
        ranking.clear();
        ranking.putAll(sortedMap);
    }
}
