import CLIApplication from './app/cli-application.js';
import HelpCommand from './cli-commands/help.command.js';
import ImportCommand from './cli-commands/import.command.js';
import VersionCommand from './cli-commands/version.command.js';

const myManager = new CLIApplication();
myManager.registerCommands([
  new HelpCommand, new VersionCommand, new ImportCommand
]);
myManager.processCommand(process.argv);
