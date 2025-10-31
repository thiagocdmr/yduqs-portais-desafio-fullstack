import { WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // Console transport - formato legível em dev, JSON em produção
    new winston.transports.Console({
      level: isDevelopment ? 'debug' : 'info',
      format: isDevelopment
        ? winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize({ all: true }),
            nestWinstonModuleUtilities.format.nestLike('Backend', {
              prettyPrint: true,
              colors: true,
            }),
          )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
    }),

    // Arquivo de erros - apenas erros em JSON estruturado
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // Arquivo combinado - todos os logs em JSON estruturado
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
