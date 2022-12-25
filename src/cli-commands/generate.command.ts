import chalk from 'chalk';
import got from 'got';
import { MockData } from '../types/mock-data.type.js';
import FileWriter from '../utils/file-writer/file-writer.js';
import OfferGenerator from '../utils/offer-generator/offer-generator.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`${chalk.red('Не удается получить данные из')} ${url}.`);
    }

    const offerGenerator = new OfferGenerator(this.initialData);
    const fw = new FileWriter(process.cwd() + filepath);

    for (let i = 0; i < offerCount; i++) {
      await fw.write(offerGenerator.generate());
    }

    console.log(`Файл ${chalk.green(filepath)} успешно создан!`);
  }
}
