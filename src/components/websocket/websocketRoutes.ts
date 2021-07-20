import { Router } from 'express'
import * as websocketHandler from './websocketHandler'

class websocketRoutes {
  public router: Router
  constructor() {
    this.router = Router()
    this.initRoutes()
  }

  private initRoutes() {
    this.router.post('/websocket', websocketHandler.sendData)
  }
}

export default new websocketRoutes().router
