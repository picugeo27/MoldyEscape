package com.moldyescape.moldyescape;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.lang.foreign.Linker.Option;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/users")   // cuando se use api users solo se llamara este metodo
public class UserController {

    @Autowired  // susceptible de ser inyectado
    private UserService userService;


    public UserController(UserService user){
        this.userService = user;
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@RequestParam String username) throws IOException{
        Optional<User> user = this.userService.getUser(username);

        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    
    @PostMapping // se ejecuta sobre la raiz
    public ResponseEntity<User> registerUser(@RequestBody User entity) {
        boolean added = this.userService.registerUser(entity);
        if(added){
            return ResponseEntity.ok(entity);
        } else{
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    
    @DeleteMapping
    public ResponseEntity<Boolean> deleteUser(@PathVariable String username){
        this.userService.deleteUser(username);
        return ResponseEntity.ok(true); // el .ok hace que sea el tipo que tiene que devolver
    }
}
