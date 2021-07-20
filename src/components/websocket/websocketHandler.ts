import { Request, Response, NextFunction } from 'express'
import * as requestParams from './websocketParams'
import boom from '@hapi/boom'

const sendData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requestParams.sendData.validate(req.body)
  } catch (err) {
    console.log(err)
    return next(boom.badRequest(err[0].message))
  }

  try {
    var io = req.app.get('io')
    io.sockets
      .in(req.body.merchantId + '_' + req.body.storeId)
      .emit('data', [{ model: req.body.model, data: [req.body.data], source: 'api' }])

    res.json({ success: 1, response: req.body, message: 'data sent' })
  } catch (err) {
    next(boom.badImplementation(err))
  }
}

export { sendData }
