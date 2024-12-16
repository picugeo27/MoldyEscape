package com.moldyescape.moldyescape;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired // susceptible de ser inyectado
    private final UserDao userdao;

    private final ReentrantReadWriteLock lock;

    // variable que guardara todos los usuarios, es global para no ir leyendola cada
    // vez que vamos a mirar algo
    private List<User> allUsers;

    public UserService(UserDao userDao) throws IOException {
        this.userdao = userDao;
        this.lock = new ReentrantReadWriteLock();
        loadAllUsers();
    }

    // carga todos los usuarios a la variable
    private void loadAllUsers() throws IOException {
        var readLock = lock.readLock();
        readLock.lock();
        try {
            allUsers = userdao.getAllUsers(); // Carga los usuarios desde el DAO
        } finally {
            readLock.unlock();
        }
    }

    // busca el usuario que se pide y lo devuelve
    public Optional<User> getUser(String username) throws IOException {
        var readLock = lock.readLock();
        readLock.lock();
        try {

            for (var user : allUsers) {
                if (user.getUsername().equals(username)) {
                    return Optional.of(user);
                }
            }
            return Optional.empty();

        } finally {
            readLock.unlock();
        }
    }

    // se pasa un usuario, si ya existe el nombre de usuario devuelve falso
    // si no existe ese nombre de usuario lo crea y devuelve true
    public boolean registerUser(User newUser) throws IOException {

        if (existsUser(newUser.getUsername())) {
            return false;
        } else {
            var writeLock = lock.writeLock();
            writeLock.lock();

            try {
                boolean added = this.userdao.updateUser(newUser);
                loadAllUsers();
                return added;
            } finally {
                writeLock.unlock();
            }
        }

    }

    // busca el nombre de usuario en la lista, si lo encuentra compara contraseñas
    // si son iguales devuelve true (que se puede iniciar sesion), si no devuelve
    // UNAUTHORIZED
    // si no se encuentra el usuario devuelve NOT_FOUND
    public ResponseEntity<Boolean> loginUser(String username, String password) {
        for (var user : allUsers) {
            if (user.getUsername().equals(username)) {
                if (user.getPassword().equals(password))
                    return (ResponseEntity.ok(true));
                else
                    return (ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
            }
        }
        return (ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // borra el usuario y devuelve true si sale y false sino
    public boolean deleteUser(String username) {
        var writeLock = lock.writeLock();
        writeLock.lock();
        try {
            boolean deleted = this.userdao.deleteUser(username);
            return deleted;
        } finally {
            writeLock.unlock();
        }
    }

    public boolean addWin(String username){
        var writeLock = lock.writeLock();
        writeLock.lock();
        try {
            for(var user: allUsers){
                if(user.getUsername().equals(username)){
                    user.addWin();
                    boolean added = this.userdao.updateUser(user);
                    return added;
                }
            }
            
        } finally {
            writeLock.unlock();
        }
        return false;
    }

    // devuelve true si ya existe el usuario, sino devuelve false
    private boolean existsUser(String username) throws IOException {
        var readLock = lock.readLock();
        readLock.lock();
        try {

            for (var user : allUsers) {
                if (user.getUsername().equals(username)) {
                    return true;
                }
            }
        } finally {
            readLock.unlock();
        }
        return false;
    }

}