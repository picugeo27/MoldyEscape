UserController:

	getConnectedCount - Devuelve un entero con el número total de usuarios actualmente 	conectados al sistema.
	getConnectedUsers - Devuelve una lista de nombres de usuarios que están actualmente 	conectados.
	getUser -Busca un usuario en el sistema por su nombre de usuario.

	getWins -Devuelve un entero con la cantidad de victorias registradas de un usuario 	específico.

	getRanking - Devuelve el ranking general de los usuarios, ordenado por la cantidad de 	victorias.

	getTopUsers - Obtiene los usuarios con el mayor numero de victorias.

	registerUser - Registra un nuevo usuario en el sistema.

	logoutUser - Desconecta a un usuario del sistema y termina su sesión.
	
	addWin - Registra una victoria a un usuario especifico.

	keepAlive - Mantiene activa la conexión de un usuario, indicando al sistema que el 	usuario sigue conectado.

	deleteUser - Elimina a un usuario del sistema y borra su información del ranking.


	

ChatController:
	getMethodName - Recupera todos los mensajes del chat.
	putMethodName - Permite enviar un mensaje al chat, asociándolo con un usuario.
