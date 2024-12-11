package com.moldyescape.moldyescape;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MoldyescapeApplication {

	@Bean (name = "userPath")	// se usa para poder hacer una iyeccion de datos
	public String getUserPath(){
		return "data/users";
	}
	
	@Bean
	public UserService getUserService(UserDao userDao){
		return new UserService(userDao);
	}

	@Bean
	public UserDao getUserDao(String userPath){
		return new UserDao(userPath);
	}
	public static void main(String[] args) {
		SpringApplication.run(MoldyescapeApplication.class, args);
	}

}
