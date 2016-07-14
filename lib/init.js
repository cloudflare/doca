import glob from 'glob';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import { ncp } from 'ncp';
import replace from 'replace';
import setTheme from './theme';

export default function init(theme, input, output) {
  let themeName = theme ? theme : 'bootstrap';
  let outputFolder = output ? path.normalize(output) : 'documentation';

  fs.access(outputFolder, fs.F_OK, function(err) {
    if (!err) {
      console.error(`Folder (output) ${chalk.red(outputFolder)} already exists!`);
    } else {
      mkdirp(outputFolder);
      console.log(`Folder ${chalk.red(outputFolder)} has been created.`);
      findSchemas(theme, input, outputFolder);
    }
  });
}

function findSchemas(theme, input, output) {
  let options = null;
  if (input) {
    options = { cwd: path.normalize(input) }
  }
  glob('**/*.json', options, (err, schemas) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Importing these schemas from ${chalk.green(input ? input : './')}:`);
      schemas.forEach(schema => console.log(chalk.blue(`- ${schema}`)));
      copyFiles(theme, input, output, schemas);
    }
  });
}

function copyFiles(theme, input, output, schemas) {
  const source = path.join(__dirname, '../app');
  ncp(source, output, err => {
    if (err) {
      return console.error(err);
    } else {
      console.log(chalk.green(`Doca project files has been copied!`));
      replaceSchemasAndTheme(theme, input, output, schemas);
    }
  });
}

function replaceSchemasAndTheme(theme, input, output, schemas) {
  const subFolders = output.split('/').length;
  const prefix = '../'.repeat(subFolders);

  console.log(chalk.green('Customizing doca project files:'));
  replace({
    regex: "###schemas###",
    replacement: schemas
      .map(schema => `  require('${path.join(prefix, input, schema)}')`)
      .join(',\n'),
    paths: [path.join(output, 'schemas.js')],
  });
  setTheme(theme, output);
};


