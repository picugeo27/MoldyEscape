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

	public static void main(String[] args) {
		SpringApplication.run(MoldyescapeApplication.class, args);
	}

}
