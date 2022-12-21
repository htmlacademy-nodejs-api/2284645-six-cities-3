import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
      ${chalk.bold('Программа для генерации и импорта данных в базу данных.')}

      ${chalk.underline.bold('Пример:')}
          main.js ${chalk.black.bgGreen('--<command>')} ${chalk.gray('[--arguments]')}

      ${chalk.underline.bold('Команды:')}
          --version                    # выводит номер версии
          --help                       # печатает этот текст
          --import ${chalk.gray('<path>')}              # импортирует данные из TSV
    `);
  }
}
