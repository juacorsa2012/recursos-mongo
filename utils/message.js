const SUCCESS = 'success'
const ERROR   = 'error'
const INTERNAL_SERVER_ERROR   = 'Internal Server Error'
const SERVIDOR_CORRIENDO      = 'Servidor corriendo en el puerto'
const CONEXION_DB_CORRECTA    = 'Conexión a la base de datos correcta'
const CONEXION_DB_ERROR       = 'Ha sido imposible conectar con la base de datos'
const OBJECT_ID_NO_VALIDO     = 'El id mongoose no tiene un formato válido'
const NOMBRE_REQUERIDO        = 'El nombre es un campo requerido'
const UNIDADES_REQUERIDAS     = 'El número de unidades es un campo requerido'
const UNIDADES_MINIMAS        = 'El número de unidades debe ser como mínimo de 1'
const TEMA_NO_ENCONTRADO      = 'El tema no existe en la base de datos'
const TEMA_REGISTRADO         = 'El tema se ha registrado con éxito'
const TEMA_ACTUALIZADO        = 'El tema se ha actualizado con éxito'
const IDIOMA_NO_ENCONTRADO    = 'El idioma no existe en la base de datos'
const IDIOMA_REGISTRADO       = 'El idioma se ha registrado con éxito'
const IDIOMA_ACTUALIZADO      = 'El idioma se ha actualizado con éxito'
const EDITORIAL_NO_ENCONTRADA = 'La editorial no existe en la base de datos'
const EDITORIAL_REGISTRADA    = 'La editorial se ha registrado con éxito'
const EDITORIAL_ACTUALIZADA   = 'La editorial se ha actualizado con éxito'
const FABRICANTE_NO_ENCONTRADO= 'El fabricante no existe en la base de datos'
const FABRICANTE_REGISTRADO   = 'El fabricante se ha registrado con éxito'
const FABRICANTE_ACTUALIZADO  = 'El fabricante se ha actualizado con éxito'
const LIBRO_NO_ENCONTRADO     = 'El libro no existe en la base de datos'
const LIBRO_REGISTRADO        = 'El libro se ha registrado con éxito'
const LIBRO_ACTUALIZADO       = 'El libro se ha actualizado con éxito'
const TITULO_REQUERIDO        = 'El título del libro es un dato requerido'
const TUTORIAL_NO_ENCONTRADO  = 'El tutorial no existe en la base de datos'
const TUTORIAL_REGISTRADO     = 'El tutorial se ha registrado con éxito'
const TUTORIAL_ACTUALIZADO    = 'El tutorial se ha actualizado con éxito'
const TEMA_REQUERIDO          = 'El tema es un dato requerido'
const EDITORIAL_REQUERIDA     = 'La editorial es un dato requerido'
const IDIOMA_REQUERIDO        = 'el idioma es un dato requerido'
const PAGINAS_REQUERIDO       = 'El número de páginas es un dato requerido'
const PAGINAS_MINIMO          = 'El número de páginas debe ser como mínimo de una'
const PUBLICADO_REQUERIDO     = 'El año de publicación es un dato requerido'
const PUBLICADO_LIBRO_MINIMO  = 'El año de publicación no puede ser anterior a 2005'
const PUBLICADO_MAXIMO        = 'El año de publicación no puede ser posterior al año en curso'
const FABRICANTE_REQUERIDO    = 'El fabricante es un dato requerido'
const DURACION_REQUERIDA      = 'La duración es un dato requerido'
const DURACION_MINIMA         = 'La duración del tutorial debe ser como mínimo de un minuto'
const PUBLICADO_TUTORIAL_MINIMO  = 'El año de publicación no puede ser anterior a 2005'
const EMAIL_REQUERIDO         = 'El email del usuario es un dato requerido'
const EMAIL_NO_VALIDO         = 'El email no es válido'
const PASSWORD_REQUERIDO      = 'El password del usuario es un dato requerido'
const PASSWORD_NO_VALIDO      = 'El password del usuario debe tener al menos 8 caracteres'
const CREDENCIALES_INCORRECTAS= 'Email y/o contraseña incorrecta'
const INICIAR_SESION          = 'Debe iniciar sesión para poder completar la acción requerida'
const USUARIO_REQUERIDO       = 'El usuario no existe en la base de datos'
const SIN_PERMISOS            = 'Opps!!. No dispones de los permisos necesarios para completar la acción solicitada'
const LIMITE_PETICIONES       = 'Demasiadas peticiones desde esta IP'

module.exports = {
    SUCCESS,
    ERROR,  
    SERVIDOR_CORRIENDO,
    INTERNAL_SERVER_ERROR,
    CONEXION_DB_CORRECTA,
    CONEXION_DB_ERROR,
    NOMBRE_REQUERIDO,
    OBJECT_ID_NO_VALIDO,
    UNIDADES_REQUERIDAS,
    UNIDADES_MINIMAS,     
    TEMA_NO_ENCONTRADO,   
    TEMA_REGISTRADO,  
    TEMA_ACTUALIZADO,     
    IDIOMA_REGISTRADO,    
    IDIOMA_NO_ENCONTRADO,
    EDITORIAL_NO_ENCONTRADA,
    EDITORIAL_REGISTRADA,
    EDITORIAL_ACTUALIZADA,   
    FABRICANTE_NO_ENCONTRADO,
    FABRICANTE_REGISTRADO,   
    FABRICANTE_ACTUALIZADO,  
    LIBRO_ACTUALIZADO,       
    LIBRO_NO_ENCONTRADO,
    TUTORIAL_ACTUALIZADO,    
    TUTORIAL_NO_ENCONTRADO,  
    TUTORIAL_REGISTRADO,     
    PUBLICADO_LIBRO_MINIMO,
    PUBLICADO_REQUERIDO,
    TITULO_REQUERIDO,
    TEMA_REQUERIDO,
    EDITORIAL_REQUERIDA,
    IDIOMA_REQUERIDO,
    PAGINAS_REQUERIDO,
    PAGINAS_MINIMO,
    LIBRO_REGISTRADO,
    IDIOMA_ACTUALIZADO,
    DURACION_MINIMA,
    PUBLICADO_MAXIMO,
    PUBLICADO_TUTORIAL_MINIMO,
    FABRICANTE_REQUERIDO,
    DURACION_REQUERIDA,
    EMAIL_NO_VALIDO,
    EMAIL_REQUERIDO,
    CREDENCIALES_INCORRECTAS,
    PASSWORD_REQUERIDO,
    PASSWORD_NO_VALIDO,
    INICIAR_SESION,
    SIN_PERMISOS,
    USUARIO_REQUERIDO,
    LIMITE_PETICIONES
}