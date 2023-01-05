import { ConfigSchema } from './config.schema';

export interface ConfigInterface {
  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
}
