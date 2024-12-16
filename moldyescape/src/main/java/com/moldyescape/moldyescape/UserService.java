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

    public void initRanking(Ranking ranking) {
        for (var user : allUsers) {
            ranking.addUser(user);
        }
    }

    // busca el usuario que se pide y lo devuelve
    public Optional<User> getUser(String username) throws IOException {

        for (var user : allUsers) {
            if (user.getUsername().equals(username)) {
                return Optional.of(user);
            }
        }
        return Optional.empty();

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

            int i = getUserIndex(username);
            if (i != -1)
                allUsers.remove(i);
            return deleted;
        } finally {
            writeLock.unlock();
        }
    }

    public boolean addWin(String username) {
        var writeLock = lock.writeLock();
        writeLock.lock();
        try {
            for (var user : allUsers) {
                if (user.getUsername().equals(username)) {
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

    public ResponseEntity<Integer> getWins(String username) {
        var readLock = lock.readLock();
        readLock.lock();
        try {

            for (var user : allUsers) {
                if (user.getUsername().equals(username)) {
                    return ResponseEntity.ok(user.getMatchesWon());
                }
            }
        } finally {
            readLock.unlock();
        }
        return (ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // devuelve true si ya existe el usuario, sino devuelve false
    private boolean existsUser(String username) throws IOException {
        for (var user : allUsers) {
            if (user.getUsername().equals(username)) {
                return true;
            }
        }
        return false;
    }

    private int getUserIndex(String username) {
        for (int i = 0; i < allUsers.size(); i++) {
            if (allUsers.get(i).getUsername().equals(username))
                return i;
        }
        return -1;
    }
}