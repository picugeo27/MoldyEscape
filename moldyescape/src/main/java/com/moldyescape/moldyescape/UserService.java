package com.moldyescape.moldyescape;
import java.io.IOException;
import java.lang.foreign.Linker.Option;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService{

    @Autowired  // susceptible de ser inyectado
    private final UserDao userdao;

    private final ReentrantReadWriteLock lock;
    
    public UserService(UserDao userDao){
        this.userdao = userDao;
        this.lock = new ReentrantReadWriteLock();
    }

    public Optional<User> getUser(String username) throws IOException{
        var readLock = lock.readLock();
        readLock.lock();
        try{
            var allUsers = this.userdao.getAllUsers();

        for(var user:allUsers){
            if (user.getUsername().equals(username)){
                return Optional.of(user);
            }
        }
        return Optional.empty();
        
        } finally{
            readLock.unlock();
        }
    }

    public boolean registerUser(User newUser){
        var writeLock = lock.writeLock();
        writeLock.lock();

        try{
            boolean added = this.userdao.updateUser(newUser);
            return added;
        } finally{
            writeLock.unlock();
        }

    }

    public boolean deleteUser(String username){
        var writeLock = lock.writeLock();
        writeLock.lock();
        try{
            boolean deleted = this.userdao.deleteUser(username);
            return deleted;
        }finally{
            writeLock.unlock();
        }
    }
}