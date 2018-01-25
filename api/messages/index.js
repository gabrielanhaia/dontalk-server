const express = require('express')
const Message = require('./model')

const router = express.Router()

router.post('/', (req, res) => {
  Message.create(req.body.message, (err, message) => {
    if (err) res.send(err)
    res.status(200).send(message)
  })
})

router.get('/:chat/:page', (req, res) => {
  Message.paginate({ chat: req.params['chat'] }, {
      limit: 25,
      page: req.params['page'],
      sort: { _id: -1 }
    }).then(response => {
      res.status(200).send(response)
    })
})

module.exports = router