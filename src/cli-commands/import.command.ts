
import { CliCommandInterface } from './cli-command.interface.js';
import { createOffer, getErrorMessage } from '../utils/common.js';

import { getURI } from '../utils/db.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';

import UserService from '../modules/user/user.service.js';

import { RentalOfferServiceInterface } from '../modules/rentaloffer/rental-offer.interface.js';
import RentalOfferService from '../modules/rentaloffer/rental-offer.service.js';
import { RentalOffer } from '../types/rental-offer.type.js';
import { DatabaseInterface } from '../utils/database/database.interface.js';
import DatabaseService from '../utils/database/database.service.js';
import TSVFileReader from '../utils/file-reader/tsv-file-reader.js';
import { LoggerInterface } from '../utils/logger/logger.interface.js';
import ConsoleLoggerService from '../utils/logger/console-logger.service.js';
import { getRandomValue } from '../utils/random.js';
import { CommentModel, RentalOfferModel, UserModel } from '../modules/models.js';
import { CommentServiceInterface } from '../modules/comment/comment.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private rentalOfferService!: RentalOfferServiceInterface;
  private commentService!: CommentServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.rentalOfferService = new RentalOfferService(this.logger, RentalOfferModel, UserModel, CommentModel, this.commentService);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async saveOffer(offer: RentalOffer) {
    const author = await this.userService.findOrCreate({
      ...offer.author,
      password: getRandomValue(10000, 50000).toString()
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
    this.logger.info(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, port: string, dbname: string, salt: string): Promise<void> {
    const uri = getURI(login, password, host, Number(port), dbname);
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
