import program from 'commander';
import chalk from 'chalk';
import init from './init';
import setTheme from './theme';

program
  .command('init')
  .option(
    '-t, --theme <theme>',
    `Doca theme. ${chalk.grey('Default')}: ${chalk.green('bootstrap')}`
  )
  .option(
    '-i, --input <input>',
    `Folder with JSON HyperSchemas. ${chalk.grey('Default')}: It goes through the current dir.`
  )
  .option(
    '-o, --output <output>',
    `Doca project name. ${chalk.grey('Default')}: ${chalk.green('documentation')}`
  )
  .description('initialize a new doca project')
  .action(({ theme, input, output }) => init(theme, input, output));

program
  .command('theme <newTheme> <input>')
  .description('set project <input> theme to <newTheme>')
  .action(setTheme);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
