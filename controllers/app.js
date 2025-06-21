const express = require('express')
const router = express.Router()
const loginController = require('./loginController')
const adminController = require('./adminController')
const pagesController = require('./pagesController')

router.get('/', (req, res) => {
    res.redirect('/login')
})
router.use('/login', loginController)
router.use('/admin', adminController)
router.use('/dashboard', pagesController)

module.exports = router