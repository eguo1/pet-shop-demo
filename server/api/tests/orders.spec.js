const { expect } = require('chai')
const request = require('supertest')
const app = require('../../index')
// const db = require('../../db')
const { Order, LineItem, Product, User } = require('../../db/models')
const axios = require('axios')

// console.log(Order.create({
//   status: "Initialized",
//   submittedAt: "2018-04-01 08:22:52.7-05"
// }))

describe('Order Routes', () => {
  describe('api/orders', () => {
    // create seed data here

    const orderOne = {
      status: 'Initialized',
      submittedAt: '2018-04-01 08:22:52.7-05'
    }
    const orderTwo = {
      status: 'Processing',
      submittedAt: '2018-03-01 08:22:52.7-05'
    }
    const orderThree = {
      status: 'Completed',
      submittedAt: '2018-03-01 08:29:52.7-05'
    }
    const lineItemOne = {
      productId: '1',
      currentPrice: '2.00',
      quantity: '1',
      orderId: '1'
    }
    const lineItemTwo = {
      productId: '2',
      currentPrice: '4.00',
      quantity: '2',
      orderId: '2'
    }
    const productOne = {
      id: '1',
      name: 'Bone',
      inventory: '4',
      price: '2.50',
      imgUrl: 'https://i.imgur.com/zzD13aO.jpg',
      description: 'This is a fun chew toy for dogs',
      category: 'dogs'
    }
    const productTwo = {
      id: '2',
      name: 'Bone',
      inventory: '4',
      price: '2.50',
      imgUrl: 'https://i.imgur.com/zzD13aO.jpg',
      description: 'This is a fun chew toy for dogs',
      category: 'dogs'
    }
    const categoryOne = {
      name: 'dogs',
      description: 'Canis lupus familiaris'
    }
    const productCategoryOne = {
      productId: '1',
      categoryId: '2'
    }
    const userOne = {
      name: 'lamine',
      email: 'lams101@gmail.com',
      isAdmin: false,
      password: 'password',
      address: '111 south one ave',
      credentials: 'placeHolderCreds'
    }
    beforeEach(async () => {
      await Product.create(productOne)
      await Product.create(productTwo)
      const orderWon = await Order.create(orderOne)
      const orderToo = await Order.create(orderTwo)
      const lineItemWon = await LineItem.create(lineItemOne)

      const lineItemToo = await LineItem.create(lineItemTwo)
      await orderWon.addLine_item(lineItemWon)
      await orderToo.addLine_item(lineItemToo)
      const userWon = await User.create(userOne)
      orderWon.setUser(userWon)

    })


    it('GET /api/orders returns an array of orders', () => {
      return request(app)
        .get('/api/orders')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array')
          expect(res.body[0].status).to.be.equal(orderOne.status)
        })
    })

    it('GET /api/orders/:orderId returns an order object', () => {
      return request(app)
        .get('/api/orders/2')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.status).to.be.equal(orderTwo.status)
        })
    })

    it('GET /api/orders/:orderId eagerly loads the line items', () => {
      return request(app)
        .get('/api/orders/2')
        .expect(200)
        .then(res => {
          expect(res.body.line_items).to.be.an('array')
        })
    })

    it('GET /api/orders/me/1 gets a users orders and eagerly loads line items and products', () => {
      return request(app)
        .get('/api/orders/me/1')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.line_items).to.be.an('array')
          expect(res.body.line_items[0].product).to.be.an('object')
        })
    })

    it('POST /api/orders', () => {
      return request(app)
        .post('/api/orders')
        .send(orderThree)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.status).to.be.equal(orderThree.status)
        })
    })

    it('PUT /api/orders/:orderId', async () => {
      await Order.create(orderThree)
      return request(app)
        .put('/api/orders/3')
        .send({
          ...orderThree,
          status: 'Initialized'
        })
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.status).to.be.equal('Initialized')
        })
    })

  })
})
