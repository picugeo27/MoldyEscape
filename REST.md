UserController:

 - getConnectedUsers - Devuelve una lista de nombres de usuarios que están actualmente conectados.
 - getWins -Devuelve un entero con la cantidad de victorias registradas de un usuario específico.
 - getRanking - Devuelve una lista con los 5 usuarios con más victorias, ordenado por la cantidad de victorias.
 - registerUser - Registra un nuevo usuario en el sistema.
 - addWin - Registra una victoria a un usuario especifico.
 - keepAlive - Mantiene activa la conexión de un usuario, indicando al sistema que el usuario sigue conectado.
 - deleteUser - Elimina a un usuario del sistema y borra su información del ranking.

ChatController:
 - getMethodName - Recupera todos los mensajes del chat.
 - putMethodName - Permite enviar un mensaje al chat, asociándolo con un usuario.

Funciones implementadas pero no utilizadas:

 - getConnectedCount - Devuelve un entero con el número total de usuarios actualmente conectados al sistema.
 - getUser -Busca un usuario en el sistema por su nombre de usuario.
 - logoutUser - Desconecta a un usuario del sistema y termina su sesión.

Resumen de las clases .java
  - **UserService:** hace de intermediario entre el user controller y el user dao
  - **UserDao:** es el encargado de escribir y leer la informacion en memoria
  - **User:** Es la estructura de datos de usuario, que contiene nombre, contraseña y numero de victorias
  - **Ranking:** Se encarga de gestionar el ranking, incluyendo la estructura de datos con sus métodos. El ranking no se guarda en memoria, se va reordenando a medida que se agregan jugadores y se actualizan sus puntuaciones
  - **MoldyEscapeApplication:** Es la clase que tiene el main y ejecuta el sistema
  - **KeepAlive:** Gestiona los usuarios conectados actualmente. Cada 5 segundos mira la lista de usuarios que envían keep alive, si alguno no ha enviado nada en los ultimos 10 segundos se da por hecho que se ha desconectado
  - **ChatService**: Es el intermediario entre el controller del chat y la estructura. Esta información no se guarda en memoria
  - **Chat:** Es la estructura del chat
  - **UserController y ChatController:** Son los que reciben las peticiones y se encargan de llamar a los métodos correspondientes
