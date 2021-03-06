'use strict'

const db = require('../server/db/db')
const { User, LineItem, Order, Product, Review, Category } = require('../server/db/models')
const { productData, categoryData, reviewData, userData, orderData, lineItemData } = require('./data')

const seed = async () => {

  await db.sync({ force: true })


  await Promise.all(categoryData.map(cData => Category.create({ ...cData })))

  console.log(`
    Seeding of Categories table successful!`)

  await Promise.all(productData.map(async pData => {
    const { category, ...data } = pData
    const product = await Product.create({ ...data })
    const categoryFromDb = await Category.findOne({ where: { name: category } })
    await product.addCategory(categoryFromDb)
  }))

  console.log(`
    Seeding of Products table successful!`)

  await Promise.all(userData.map(uData => User.create({ ...uData })))

  console.log(`
    Seeding of Users table successful!`)

  await Promise.all(reviewData.map(rData => Review.create({ ...rData })))

  console.log(`
    Seeding of Reviews table successful!`)

  await Promise.all(orderData.map(oData => Order.create({ ...oData })))

  console.log(`
    Seeding of Orders table successful!`)

  await Promise.all(lineItemData.map(lData => LineItem.create({ ...lData })))

  console.log(`
    Seeding of Line Items table successful!
  `)


  db.close()
}

seed().catch(error => {
  db.close()
  console.log(`

    Something unintended occurred:

    ${error.message}

    ${error.stack}

  `)
})
