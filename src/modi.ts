import * as fs from 'fs';
import {spawn} from 'child_process';

if (fs.existsSync(`./src/${process.argv[2]}`)){
  console.log((`File ${process.argv[2]} exists`));
  const cut = spawn('cut', [`-d`, `,`, `-f`, `${process.argv[3]}`, `./src/${process.argv[2]}`]); 
  cut.stdout.pipe(process.stdout);

  fs.watchFile(`./src/${process.argv[2]}`, () => {
    if (fs.existsSync(`./src/${process.argv[2]}`)){
      const cut = spawn('cut', [`-d`, `,`, `-f`, `${process.argv[3]}`, `./src/${process.argv[2]}`]); 
      cut.stdout.pipe(process.stdout);
      console.log();
    }
    else{
      console.error('File moved or deleted');
    }
  });
}
else{
  console.error((`File ${process.argv[2]} doesn't exists`));
}

/**
 * Preguntas:
 * 2. Pruebe a ejecutar el comando cut desde una terminal de la siguiente manera, para comprender su 
 * funcionamiento. Ej: cut -d ',' -f 1. ¿Qué muestra el comando por la consola?
 * Eduardo
   Alejandro
   Luis
 * ¿Qué sucede si utilizamos el valor 3 para la opción -f? 
   Que seleccionaría los valores del segundo apellido en este caso:
    Gonzalez
    Díaz
    Forte
 * ¿Y si usamos el valor 4?
    Mostraría 3 espacios en blanco por pantalla
  * ¿Qué permite indicar la opción -d?
    El delimitador, lo que se va a buscar para cortar.
 */

/**
 * import {spawn} from 'child_process';
 * watchFile('helloworld.txt', (curr, prev) => {
  console.log(`File was ${prev.size} bytes before it was modified.`);
  console.log(`Now file is ${curr.size} bytes.`);

  const cat = spawn('cat', ['-n', 'helloworld.txt']);
  cat.stdout.pipe(process.stdout);
});
 */

/**
 * ¿Qué sucede si el fichero pasado desde la línea de comandos al programa anterior no existe?
 * Al empezar a realizar la práctica se ha tenido en cuenta, por ello con el fs.existsSync() comprobamos que 
 * existe
 */