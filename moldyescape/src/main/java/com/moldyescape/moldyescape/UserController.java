package com.moldyescape.moldyescape;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/users") // cuando se use api users solo se llamara este metodo
public class UserController {

    @Autowired // susceptible de ser inyectado
    private UserService userService;
    @Autowired
    private KeepAlive keepAliveService;
    private Ranking ranking = new Ranking();

    public UserController(UserService user) {
        this.userService = user;
        this.userService.initRanking(ranking);
    }

    //
    // PETICIONES GET
    //

    @GetMapping
    public ResponseEntity<User> getUser(@RequestParam String username) throws IOException {
        Optional<User> user = this.userService.getUser(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/connectedcount")
    public int getConectedCount() {
        return keepAliveService.getConnectedUsersCount();
    }

    @GetMapping("/connectedusers")
    public Set<String> getConnectedUsers() {
        return keepAliveService.getConnectedUsers();
    }

    @GetMapping("/getwins{username}")
    public int getWins(@RequestParam String username) {
        return ranking.getUserWins(username);
    }

    @GetMapping("/getranking")
    public List<String> getRanking() {
        return ranking.getTopUsers();
    }

    //
    // PETICIONES POST
    //

    @PostMapping("/register") // se ejecuta sobre la raiz
    public ResponseEntity<User> registerUser(@RequestBody User entity) throws IOException {
        boolean added = this.userService.registerUser(entity);
        if (added) {
            return ResponseEntity.ok(entity);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> loginUser(@RequestParam String username, @RequestParam String password) {
        return userService.loginUser(username, password);
    }

    @PostMapping("/logout/{username}")
    public ResponseEntity<String> logoutUser(@PathVariable String username) {
        keepAliveService.disconnectUser(username);
        return ResponseEntity.ok("Sesion cerrada");
    }

    @PostMapping("/keepalive/{username}")
    public ResponseEntity<String> keepAlive(@PathVariable String username) {
        keepAliveService.keepAlive(username);
        return ResponseEntity.ok("Keep alive recibido");
    }

    //
    // PETICIONES PUT
    //

    @PutMapping("win")
    public ResponseEntity<Boolean> putMethodName(@RequestBody String username) {
        ranking.addWin(username);
        userService.addWin(username);
        return ResponseEntity.ok(true);
    }

    //
    // PETICIONES DELETE
    //

    @DeleteMapping("")
    public ResponseEntity<String> deleteUser(@RequestBody String username) {
        boolean deleted = this.userService.deleteUser(username);
        if (deleted) {
            ranking.deleteUser(username);
            return ResponseEntity.ok("Usuario eliminado"); // el .ok hace que sea el tipo que tiene que devolver
        }

        else
            return ResponseEntity.ok("Error al borrar");
    }

}
