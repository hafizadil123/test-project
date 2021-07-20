import winston, { Logger, LoggerOptions, transports } from 'winston'

const options: LoggerOptions = {
  transports: [
    new transports.Console({
      level: 'debug'
    })
  ]
}

const logger: Logger = winston.createLogger(options)

if (process.env.NODE_ENV !== 'prod') {
  logger.debug('Logging initialized at debug level')
}

class LoggerStream {
  public write(text: string) {
    logger.info(text)
  }
}

const loggerStream = new LoggerStream()

export { logger, loggerStream }
