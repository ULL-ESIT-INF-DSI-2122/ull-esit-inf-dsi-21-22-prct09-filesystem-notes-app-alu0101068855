import * as fs from 'fs';
import * as chalk from 'chalk';
import * as yargs from 'yargs';
import * as path from 'path';
/**
 * Class JsonObject
 */
export class JsonObject{
  constructor(private user: string, private title: string, private body: string, private color: string ){}
  getUser(){
    return this.user;
  }
  getTitle(){
    return this.title;
  }
  getBody(){
    return this.body;
  }
  getColor(){
    return this.color;
  }
}

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
    if (fs.existsSync(`./dist/${argv.user}`)){
      console.log(chalk.green(`Dir ./dist/${argv.user} exists`));
    }
    else{
      fs.mkdir(path.join(__dirname, String(argv.user)), (err) => {
        if (err) {
          return console.error(chalk.red(err));
        }
        else {
          console.log(chalk.green(`Created dir ${argv.user} at ./dist/`));
        }
      });
    }
    //Sin timeout no se puede crear
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}.json`)){
      console.error(chalk.red('This file already exists'));
    }
    else{
    let obj = new JsonObject(String(argv.user), String(argv.title), String(argv.body), String(argv.color));
    let json = JSON.stringify(obj, null, 2);

      setTimeout(() => {
        fs.writeFile(`./dist/${argv.user}/${argv.title}.json`, json, 'utf8', (err) => {
          if (err) {
            return console.error(chalk.red(err));
          }
          else{
            console.log(chalk.green(`Created ${argv.title}`));
          }
        });
      }, 1000);
    }
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
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}.json`)){
      let obj = new JsonObject(String(argv.user), String(argv.title), String(argv.body), String(argv.color));
      let json = JSON.stringify(obj, null, 2);

      fs.writeFile(`./dist/${argv.user}/${argv.title}.json`, json, 'utf8', (err) => {
        if (err) {
          return console.error(chalk.red(err));
        }
        else{
          console.log(chalk.green(`Modified ${argv.title}`));
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
      fs.readdir(`./dist/${argv.user}`, (err, files) => {
        if (err) {
          return console.error(chalk.red(err));
        }
        else {
          files.forEach(element => {
          let obj = require(`./${argv.user}/${element}`);
          if (obj.color === 'yellow'){
            console.log(chalk.yellow(obj.title));
          }
          if (obj.color === 'red'){
            console.log(chalk.red(obj.title));
          }
          if (obj.color === 'green'){
            console.log(chalk.green(obj.title));
          }
          if (obj.color === 'blue'){
            console.log(chalk.blue(obj.title));
          }
          });
        }
      });
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
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}.json`)){
      fs.promises.rm(`./dist/${argv.user}/${argv.title}.json`);
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
    if (fs.existsSync(`./dist/${argv.user}/${argv.title}.json`)){
      console.log(chalk.green(`${argv.title}:`));      
      let obj = require(`./${argv.user}/${argv.title}.json`);
      if (obj.color === 'yellow'){
        console.log(chalk.yellow(obj.body));
      }
      if (obj.color === 'red'){
        console.log(chalk.red(obj.body));
      }
      if (obj.color === 'green'){
        console.log(chalk.green(obj.body));
      }
      if (obj.color === 'blue'){
        console.log(chalk.blue(obj.body));
      }
    }
    else{
      console.error(chalk.red(`Invalid user: ${argv.user} or filename: ${argv.title}`));
    }
  }
});

yargs.parse();
