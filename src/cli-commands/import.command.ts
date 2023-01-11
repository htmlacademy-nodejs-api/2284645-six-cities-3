
import { CliCommandInterface } from './cli-command.interface.js';
import { createOffer, getErrorMessage } from '../utils/common.js';

import { getURI } from '../utils/db.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';

import UserService from '../modules/user/user.service.js';

import { UserModel } from '../modules/user/user.entity.js';
import { RentalOfferModel } from '../modules/rentaloffer/rental-offer.entity.js';
import { RentalOfferServiceInterface } from '../modules/rentaloffer/rental-offer.interface.js';
import RentalOfferService from '../modules/rentaloffer/rental-offer.service.js';
import { RentalOffer } from '../types/rental-offer.type.js';
import { DatabaseInterface } from '../utils/database/database.interface.js';
import DatabaseService from '../utils/database/database.service.js';
import TSVFileReader from '../utils/file-reader/tsv-file-reader.js';
import { LoggerInterface } from '../utils/logger/logger.interface.js';
import ConsoleLoggerService from '../utils/logger/console-logger.service.js';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private rentalOfferService!: RentalOfferServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.rentalOfferService = new RentalOfferService(this.logger, RentalOfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async saveOffer(offer: RentalOffer) {
    const author = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.rentalOfferService.create({
      ...offer,
      authorId: author.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
