import * as fs from 'fs';
import * as chalk from 'chalk';
import * as yargs from 'yargs';
import {spawn} from 'child_process';
import * as path from 'path';

/*Leer archivo si se encuentra
fs.readFile('./what.txt', (err, data) => {
  if(err){
    console.error('There must be a problem with the file')
  }
  else {
  console.log(data.toString());
  }
})*/

/*
fs.watchFile('helloworld.txt', (curr, prev) => {
  console.log(`File was ${prev.size} bytes before it was modified.`);
  console.log(`Now file is ${curr.size} bytes.`);

  // Hacer un cat como bash en la salida estandar del proceso
  const cat = spawn('cat', ['-n', 'helloworld.txt']);
  cat.stdout.pipe(process.stdout);

  const wc = spawn('wc', ['helloworld.txt']);

  let wcOutput = '';
  wc.stdout.on('data', (piece) => wcOutput += piece);

  wc.on('close', () => {
    const wcOutputAsArray = wcOutput.split(/\s+/);
    console.log(`File helloworld.txt has ${wcOutputAsArray[1]} lines`);
    console.log(`File helloworld.txt has ${wcOutputAsArray[2]} words`);
    console.log(`File helloworld.txt has ${wcOutputAsArray[3]} characters`);
  });
});

const inputStream = fs.createReadStream('helloworld.txt');

inputStream.on('data', (piece) => {
  process.stdout.write(piece);
});

inputStream.on('error', (err) => {
  process.stderr.write(err.message);
});
*/
/**
 * Commands add
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Name user',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Body of the note',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color of the letters',
      demandOption: true,
      type: 'string',
    }
  },
  handler(argv) {
    if (typeof argv.title === 'string') {
      console.log(chalk.green('New note added!'));  
    }

    if (fs.existsSync(`./dist/${argv.user}`)){
      console.log(chalk.green(`Dir ./dist/${argv.user} exists`));
    }
    else{
      fs.mkdir(path.join(__dirname, `./dist/${argv.user}`), (err) => {
        if (err) {
          return console.error(chalk.red(err));
        }
        else {
          console.log(chalk.green(`Created dir ${argv.user} at ./dist/`));
        }
      });
    }

    //Sin timeout no se puede crear
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}.txt`)){
      console.error(chalk.red('This file already exists'));
    }
    else{
      setTimeout(() => {
        fs.writeFile(`./dist/${argv.user}/${argv.title}.txt`, `${argv.body}`, (err) => {
          if (err) {
            return console.error(chalk.red(err));
          }
          else{
            console.log(chalk.green(`Created ${argv.title}.txt`));
          }
        });
      }, 1000);
    }
    /*
    if (argv.color === 'red'){
      console.log(chalk.red(argv.body));
    }
    if (argv.color === 'green'){
      console.log(chalk.green(argv.body));
    }
    if (argv.color === 'blue'){
      console.log(chalk.blue(argv.body));
    }
    if (argv.color === 'yellow'){
      console.log(chalk.yellow(argv.body));
    }
    */
},
});

/**
 * Commands modify
 */
yargs.command({
  command: 'mod',
  describe: 'Modify a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Body of the note',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color of the letters',
      demandOption: true,
      type: 'string',
    }
  },
  handler(argv) {
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}.txt`)){
      fs.writeFile(`./dist/${argv.user}/${argv.title}.txt`, `${argv.body}`, (err) => {
        if (err) {
          return console.error(chalk.red(err));
        }
        else{
          console.log(chalk.green(`Modified ${argv.title}.txt`));
        }
      });
    }
    else{
      console.error(chalk.red(`This file doesn't exists`));
    }
},
});
/**
 * Commands list
 */
yargs.command({
  command: 'list',
  describe: 'Lists all users notes',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    } 
  },
  handler(argv) {
    if (fs.existsSync(`./dist/${argv.user}`)){
      console.log(chalk.green(`Your notes`));
      let ls = spawn('ls', [`./dist/${argv.user}`]);
      ls.stdout.pipe(process.stdout);
    }
    else{
      console.error(chalk.red(`Invalid user: ${argv.user}`));
    }
  }
});

/**
 * Commands remove
 */
yargs.command({
  command: 'remove',
  describe: 'remove an user note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    }, 
    title: {
      describe: 'Note title to delete',
      demandOption: true,
      type: 'string',
    }
  },
  handler(argv) {
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}`)){
      fs.promises.rm(`./dist/${argv.user}/${argv.title}`);
      console.log(chalk.green(`Note: ${argv.user}/${argv.title} removed`));
    }
    else{
      console.error(chalk.red(`Invalid user: ${argv.user} or filename: ${argv.title}`));
    }
  }
});

/**
 * Commands read
 */
yargs.command({
  command: 'read',
  describe: 'Read an user note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title to read',
      demandOption: true,
      type: 'string',
    } 
  },
  handler(argv) {
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}`)){
      console.log(chalk.green(`${argv.title}:`));
      let cat = spawn('cat', [`./dist/${argv.user}/${argv.title}`]);
      cat.stdout.pipe(process.stdout);
      setTimeout(() => {
        console.log();
      }, 1000);
    }
    else{
      console.error(chalk.red(`Invalid user: ${argv.user} or filename: ${argv.title}`));
    }
  }
});

yargs.parse();
