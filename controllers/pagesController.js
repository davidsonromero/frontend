const express = require('express')
const router = express.Router()
const axios = require('axios')

const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const API_URL = 'https://localhost:44394/'

router.get('/', async (req, res) => {
    try {
        if(!!!req.session.token || req.session.role !== 'resident') {
            return res.redirect('/login')
        }

        var morador = await axios.get(API_URL + 'get-by-account-email/' + req.session.email, 
        { headers: { Authorization: `Bearer ${req.session.token}`},
        httpsAgent: agent })
        req.session.idMorador = morador.data.id
        res.render("pages/index", { morador: morador.data })
    } catch (error) {
        console.error('Error in pages index:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.get('/messages', async (req, res) => {
    try {
        if(!!!req.session.token || req.session.role !== 'resident') {
            return res.redirect('/login')
        }
        var messages = await axios.get(API_URL + 'get-by-resident/' + req.session.idMorador,
        { headers: { Authorization: `Bearer ${req.session.token}`}, httpsAgent: agent });
        res.render("pages/mensagens", { messages: messages.data })
    } catch (error) {
        console.error('Error in messages page:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.post('/send-message', async (req, res) => {
    try {
        if(!!!req.session.token || req.session.role !== 'resident') {
            return res.redirect('/login')
        }
        await axios.post(API_URL + 'post-message', {
            IdResident: req.session.idMorador,
            Title: req.body.Title,
            Content: req.body.Content
        }, { headers: { Authorization: `Bearer ${req.session.token}`}, httpsAgent: agent });
        res.redirect('/dashboard/messages');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router