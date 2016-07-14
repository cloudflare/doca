import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import replace from 'replace';
import { exec } from 'child_process';

function replaceTheme(theme, input) {
  console.log(`Setting ${chalk.green(input)} theme to ${chalk.green(theme)}. Files changed:`);
  try {
    replace({
      regex: /doca-([-_a-z0-9]+)-theme/ig,
      replacement: theme,
      recursive: true,
      paths: [
        path.join(input, 'src'),
        path.join(input, 'webpack'),
      ],
    });
  } catch (err) {
    console.error(chalk.red(
      `Error: Can't find dirs ${path.join(input, 'src')} and ${path.join(input, 'webpack')}`
    ));
  }
}

function installTheme(theme, input) {
  console.log(`Trying to npm install ${chalk.green(theme)} for project ${chalk.green(input)}...`);
  exec(`npm install ${theme} --save`, { cwd: input }, (err, stdout) => {
    if (err) {
      console.error(
        chalk.red(`Error when npm installing theme ${theme}.\n${err.message}\n${stdout}`)
      );
    } else {
      console.log(chalk.green(`Theme ${theme} at ${input} has been successfully installed!`));
      replaceTheme(theme, input);
    }
  });
}

export default function setTheme(theme, input) {
  const inputFolder = path.normalize(input);
  let themeName = `doca-${theme}-theme`;
  if (theme.indexOf('doca-') > -1) {
    themeName = theme;
  }

  fs.access(inputFolder, fs.F_OK, err => {
    if (err) {
      console.error(`Folder (input) ${chalk.red(inputFolder)} does not exist!`);
    } else {
      installTheme(themeName, inputFolder);
    }
  });
}
