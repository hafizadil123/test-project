import { logger } from '../utils/logger'

const notFound = (req, res, next) => {
  const err: any = {}
  err.statusCode = 404
  err.message = `Invalid request ${req.method} ${req.originalUrl}`
  next(err)
}
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  logger.log({
    level: 'error',
    message: err
  })
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  )
  res.status(statusCode).send({
    success: 0,
    response: [],
    message: err.message
  })
}

export { errorHandler as errorHandlerMiddleware, notFound as notFoundMiddleware }
