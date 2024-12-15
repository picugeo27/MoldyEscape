package com.moldyescape.moldyescape;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling		// esto es para usar el scheduled (que se ejecute periodicamente algo y pode usar el keep alive)
public class MoldyescapeApplication {

	@Bean (name = "userPath")	// se usa para poder hacer una iyeccion de datos
	public String getUserPath(){
		return "data/users";
	}

	public static void main(String[] args) {
		SpringApplication.run(MoldyescapeApplication.class, args);
	}
}
