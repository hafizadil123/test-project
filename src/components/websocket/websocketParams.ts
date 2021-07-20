import schema from 'schm'

export const sendData = schema({
  merchantId: {
    type: String,
    required: true
  },
  storeId: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  }
})
