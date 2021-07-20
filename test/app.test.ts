import clientIO from 'socket.io-client'
import { Order, Payment } from '../src/common/types'

const client = clientIO('http://localhost:3000')

beforeAll(() => {})

afterAll(done => {
  client.close()
  done()
})

describe('Testing WebsocketsService', () => {
  test('It  should return the same data', done => {
    const order: Order = {
      orderName: 'sa',
      orderNumber: 12,
      tableId: 'dsa21'
    }
    const payment: Payment = {
      paymentAmount: 12,
      storeId: '12',
      orderId: '21'
    }
    client.emit('orders::create', order)
    client.emit('payments::create', payment)
    client.on('orders::created', (data: Order) => {
      expect(data).toBe(order)
    })
    client.on('payments::created', (data: Order) => {
      expect(data).toBe(payment)
    })

    done()
  })
})
