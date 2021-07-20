import IO, { Server } from 'socket.io'
import socketioJwt, { JwtAuthOptions } from 'socketio-jwt'
import axios, { AxiosInstance } from 'axios'
import { app } from './config'
import helmet from 'helmet'
import dotenv from 'dotenv'
import Express, { Application } from 'express'
import { createServer } from 'http'
import { loggerStream, logger } from './utils/logger'
import { errorHandlerMiddleware, notFoundMiddleware } from './middlewares/erroHandler'
import morgan from 'morgan'

import { websocketRoutes } from './components/websocket'

class WebsocketsService {
  private io: Server
  private api: AxiosInstance
  public app: Application
  constructor() {
    this.app = Express()
    const server = createServer(this.app)

    dotenv.config()
    const port = app.port as number
    const host = app.host

    const uri = process.env.MOBILEAPIGTW_URI
    this.api = axios.create({ baseURL: uri })
    this.io = IO.listen(server)
    this.app.set('io', this.io)
    server.listen(port)
    console.log(`${app.name} is running at http://${host}:${port}`)
  }

  public init() {
    this.initWebsocket()
    this.initMiddlewares()
    this.initRoutes()
  }

  public initWebsocket() {
    const options: JwtAuthOptions = {
      secret: app.jwtsecret,
      decodedPropertyName: 'decoded_token',
      timeout: 15000
    }

    this.io.on('connection', socketioJwt.authorize(options))

    this.io.on('authenticated', socket => {
      socket.storeId = socket.handshake.query.storeId || socket.decoded_token.storeId
      socket.merchantId = socket.decoded_token.merchantId
      socket.join(socket.merchantId + '_' + socket.storeId)

      socket.on('data', packet => {
        try {
          console.log('packet received: data')
          console.log({ dataReceived: JSON.stringify(packet) })

          packet.data.forEach(data => {
            let model = packet.model
            let source = packet.source || ''
            data.storeId = socket.storeId
            data.merchantId = socket.merchantId
            data.isSync = 2
            this.api
              .post(model + '/save', data)
              .then(response => {
                console.log('QUERY SAVE Data')
                console.log({ reponseData: JSON.stringify(response.data) })
                if (response.data.error) {
                  this.errorHandler(socket, response.data.message)
                } else {
                  this.io.sockets
                    .in(socket.merchantId + '_' + socket.storeId)
                    .emit('data', [
                      { model: model, data: [response.data.data], source: source }
                    ])
                }
              })
              .catch(err => {
                console.log(err)
                this.errorHandler(socket, err)
              })
          })
        } catch (error) {
          this.errorHandler(socket, error)
        }
      })

      socket.on('inventory', packet => {
        console.log('packet received')
        console.log(packet)
        packet.data.forEach(data => {
          let source = packet.source || ''
          data.storeId = socket.storeId
          data.merchantId = socket.merchantId
          data.isSync = 2

          this.api
            .post('/product/inventory', data)
            .then(response => {
              console.log('PRODUCT INVENTORY')
              console.log(response.data)
              if (response.data.error) {
                this.errorHandler(socket, response.data.message)
              } else {
                this.io.sockets
                  .in(socket.merchantId + '_' + socket.storeId)
                  .emit('data', [
                    { model: 'product', data: [response.data.data], source: source }
                  ])
                this.io.sockets
                  .in(socket.merchantId + '_' + socket.storeId)
                  .emit('inventory', packet)
              }
            })
            .catch(err => {
              console.log(err)
              this.errorHandler(socket, err)
            })
        })
      })

      socket.on('query', query => {
        try {
          console.log(query)
          if (Array.isArray(query)) {
            var promises: Array<any> = []
            query.forEach(element => {
              var data: any = {}
              data.startDate = element.startDate ? element.startDate : 0
              data.endDate = element.endDate && element.endDate != 0 ? element.endDate : 0
              data.lastUpdatedAt =
                element.lastUpdatedAt && element.lastUpdatedAt != 0 ? element.lastUpdatedAt : 0
              data.merchantId = socket.merchantId
              data.storeId = socket.storeId
              promises.push(
                this.api.get(element.model + '/query', {
                  params: data
                })
              )
            })
            Promise.all(promises)
              .then(res => {
                var response: any = []
                var error: boolean = false
                res.forEach(element => {
                  console.log(element.data)
                  if (element.data.data.error == true) {
                    error = true
                    this.errorHandler(socket, element.data)
                  } else {
                    response.push(element.data)
                  }
                })
                if (!error) {
                  console.log('QUERY RESPONSE')

                  socket.emit('query', response)
                }
              })
              .catch(error => {
                this.errorHandler(socket, error)
              })
          }
        } catch (error) {
          this.errorHandler(socket, error)
        }
      })

      socket.on('search', query => {
        try {
          console.log(query)
          if (Array.isArray(query)) {
            var promises: Array<any> = []
            query.forEach(element => {
              var data: any = {}
              data.startDate = element.startDate ? element.startDate : 0
              data.endDate = element.endDate && element.endDate != 0 ? element.endDate : 0
              data.merchantId = socket.merchantId
              data.storeId = socket.storeId
              console.log(data)
              promises.push(
                this.api.get(element.model + '/query', {
                  params: data
                })
              )
            })
            Promise.all(promises)
              .then(res => {
                var response: any = []
                var error: boolean = false
                res.forEach(element => {
                  console.log(element.data)
                  if (element.data.data.error == true) {
                    error = true
                    this.errorHandler(socket, element.data)
                  } else {
                    response.push(element.data)
                  }
                })
                if (!error) {
                  socket.emit('search', response)
                }
              })
              .catch(error => {
                this.errorHandler(socket, error)
              })
          }
        } catch (error) {
          this.errorHandler(socket, error)
        }
      })

      socket.on('serverData', packet => {
        try {
          console.log('serverData received')
          console.log(packet)
          packet.data.forEach(data => {
            let model = packet.model
            let source = packet.source || ''
            data.storeId = socket.storeId
            data.merchantId = socket.merchantId
            data.isSync = 2

            this.api
              .post(model + '/save', data)
              .then(response => {
                console.log('QUERY SAVE')
                console.log(response.data)
                if (response.data.error) {
                  this.errorHandler(socket, response.data.message)
                } else {
                  socket.emit('serverData', [
                    { model: model, data: [response.data.data], source: source }
                  ])
                }
              })
              .catch(err => {
                console.log(err)
                this.errorHandler(socket, err)
              })
          })
        } catch (error) {
          this.errorHandler(socket, error)
        }
      })

      socket.on('notification', alert => {
        try {
          this.io.sockets
            .in(socket.merchantId + '_' + socket.storeId)
            .emit('notification', alert)
        } catch (error) {
          this.errorHandler(socket, error)
        }
      })

      socket.on('disconnect', function() {
        console.log('user disconnected')
      })
    })
  }

  private initMiddlewares() {
    this.app.use(morgan('combined', { stream: loggerStream }))
    this.app.use(Express.json())
    this.app.use(helmet())
  }

  private initRoutes() {
    this.app.use(websocketRoutes)
    this.app.use(notFoundMiddleware)
    this.app.use(errorHandlerMiddleware)
  }

  public errorHandler(socket: any, error: any) {
    console.log(error)
    socket.emit('onError', error)
  }

  public close() {
    this.io.close()
  }
}

export default WebsocketsService
