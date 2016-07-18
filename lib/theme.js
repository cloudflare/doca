import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import replace from 'replace';
import { exec } from 'child_process';

function replaceTheme(theme, project) {
  console.log(`Setting ${chalk.green(project)} theme to ${chalk.green(theme)}. Files changed:`);
  try {
    replace({
      regex: /doca-([-_a-z0-9]+)-theme/ig,
      replacement: theme,
      recursive: true,
      paths: [
        path.join(project, 'src'),
        path.join(project, 'webpack'),
      ],
    });
  } catch (err) {
    console.error(chalk.red(
      `Error: Can't find dirs ${path.join(project, 'src')} and ${path.join(project, 'webpack')}`
    ));
  }
}

function installTheme(theme, project) {
  console.log(`Trying to npm install ${chalk.green(theme)} for project ${chalk.green(project)}...`);
  exec(`npm install ${theme} --save`, { cwd: project }, (err, stdout) => {
    if (err) {
      console.error(
        chalk.red(`Error when npm installing theme ${theme}.\n${err.message}\n${stdout}`)
      );
    } else {
      console.log(chalk.green(`Theme ${theme} at ${project} has been successfully installed!`));
      replaceTheme(theme, project);
    }
  });
}

export function normalizeName(theme) {
  let themeName = `doca-${theme}-theme`;
  if (theme.indexOf('doca-') > -1) {
    themeName = theme;
  }
  return themeName;
}

export default function setTheme(theme, project) {
  const projectFolder = path.normalize(project);
  const themeName = normalizeName(theme);

  fs.access(projectFolder, fs.F_OK, err => {
    if (err) {
      console.error(`Folder (project) ${chalk.red(projectFolder)} does not exist!`);
    } else {
      installTheme(themeName, projectFolder);
    }
  });
}
