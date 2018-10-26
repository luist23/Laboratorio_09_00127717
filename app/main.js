const http = require('http'),
  fs = require('fs'),
  url = require('url'),
  {
    parse
  } = require('querystring');

mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
}; 

/**¿Cuál es la principal función del módulo HTTP?
 * gestionar la coneccion del servidor
 * 
 * ¿Cuál es la principal función del módulo FileSystem?
 * gestionar el acceso a los diferentes archivos del sistema
 * 
 * ¿Qué es un MIME type?
 * es un objeto que facilita la obteccion de u archivo del servidor
 */

http.createServer((req, res)=>{
      //Control code.
    var pathname = url.parse(req.url).pathname; 
    if(pathname == "/"){
          pathname = "../index.html";
        };
    if(pathname == "../index.html"){
          fs.readFile(pathname, (err, data)=>{
        
            if (err) {
              console.log(err);
              // HTTP Status: 404 : NOT FOUND
              // En caso no haberse encontrado el archivo
              res.writeHead(404, {
                'Content-Type': 'text/html'
              });       return res.end("404 Not Found");     }
            // Pagina encontrada
            // HTTP Status: 200 : OK
        
            res.writeHead(200, {
              'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
            });
        
            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());
        
        
            // Envia la respuesta
            return res.end();
          });
        };
        
        if (req.method === 'POST' && pathname == "/cv") {
              collectRequestData(req, (err, result) => {
            
                if (err) {
                  res.writeHead(400, {
                    'content-type': 'text/html'
                  });
                  return res.end('Bad Request');
                }
            
                fs.readFile("../templates/plantilla.html", function (err, data) {
                  if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {
                      'Content-Type': 'text/html'
                    });
                    return res.end("404 Not Found");
                  }
            
                  res.writeHead(200, {
                    'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
                  });
            
                  //Variables de control.
            
                  let parsedData = data.toString().replace('${dui}', result.dui)
                    .replace("${lastname}", result.lastname)
                    .replace("${firstname}", result.firstname)
                    .replace("${gender}", result.gender)
                    .replace("${civilStatus}", result.civilStatus)
                    .replace("${birth}", result.birth)
                    .replace("${exp}", result.exp)
                    .replace("${tel}", result.tel)
                    .replace("${std}", result.std);
            
                  res.write(parsedData);
                  return res.end();
                });
            
              });
            };
    
    if(pathname.split(".")[1] == "css"){
          fs.readFile(".."+pathname, (err, data)=>{
        
            if (err) {
              console.log(err);
              res.writeHead(404, {
                'Content-Type': 'text/html'
              });       return res.end("404 Not Found");     }
        
            res.writeHead(200, {
              'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/css'
            });
        
            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());
        
        
            // Envia la respuesta
            return res.end();
          });
        } ;


/**¿Qué contine el parametro "data"? 
 * contiene el archivo solicitado por el cliente... en este caso index.html
 * 
 * ¿Cuál es la diferencia entre brindar una respuesta HTML y brindar una CSS? 
 * el tipo de contenido que se devuelve en el caso de html es 'text/html' y css 'text/css'
 * 
 * ¿Qué contiene la variable "result"?
 * contiene los datos (los pedidos medeiante inputs... principalmente) enviados por el cliente por ejemplo por el metodo submit... en este caso un formulario (posiblemente)
 * 
 * ¿Por qué con la variable "data" se debe aplicarse el metodo toString()? Justifique.
 * para obtener el contenido como un texto plano y porcesarlo posteriormente
 * 
 */






    }).listen(8081); 
    
    
function collectRequestData(request, callback) {

      const FORM_URLENCODED = 'application/x-www-form-urlencoded';
      if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        // Evento de acumulacion de data.
        request.on('data', chunk => {
          body += chunk.toString();
        });
        // Data completamente recibida
        request.on('end', () => {
          callback(null, parse(body));
        });
      } else {
        callback({
          msg: `The content-type don't is equals to ${FORM_URLENCODED}`
        });
      }
    
    } 

/**¿Qué contienen las variables "req" y "res" en la creación del servidor?
 * req contiene un fichero en el cual el cliente manda la informacion de lo que solicita
 * res contiene el fichero enviado por el servidor solicitado en caso es encontrado haciendo uso con la solicitod de cliente
 * 
 * ¿La instrucción .listen(number) puede fallar? Justifique.
 * si. siempre y cuando el puerto ya este siendo usado por otro proceso oi aplicacion
 * 
 * ¿Por qué es útil la función "collectRequestData(...)"?
 * por que se encarga de revisar si los datos recividos estan cifrados de la forma que el servidor requiere
 * 
 * 
 */


 /**complementarias
  * ¿Hay diferencia al quitar el control de peticiones para hojas CSS? Si sucedió algo distinto justifique por qué. 
  * tardo demasiado tiempo en cargar
  * ademas al terminar de cargar la pagina no carga el estilo... es decir el css no fue enviado por el servidor
  * 
  * ¿Se puede inciar el servidor (node main.js) en cualquier sitio del proyecto? Cualquier respuesta justifique. 
  * no. debido a que el archivo no puede ser encontrado en otra ruta
  * 
  * Con sus palabras, ¿Por qué es importante aprender Node.js sin el uso de frameworks a pesar que estos facilitan el manejo de API's? 
  * debido a que la ayuda de frameworks sirven para facilitar el trabajo pero tiene la desventaja de que nos oculta el como funcionan las diferentes componentes
  * aprendiendo sin frameworks luego podemos reconocer facilmente el por que se hacen las cosas que se hacen :v
  */