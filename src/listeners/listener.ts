import Queue from 'bull'
import { Server } from 'socket.io'

export default (io: Server) => {
  const ordersQueue = new Queue('data', {
    redis: {
      port: 16445,
      host: 'redis-XXXX.ec2.cloud.redislabs.com',
      password: 'password'
    }
  })
  ordersQueue.process(function(job, done) {
    const { data } = job

    io.sockets.in(data.merchantId + '_' + data.storeId).emit('data', data)
    done()
  })
}
