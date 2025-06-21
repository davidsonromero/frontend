const express = require('express')
const router = express.Router()
const axios = require('axios')
const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const API_URL = 'https://localhost:44394/'

router.get('/', async (req, res) => {
    if(!!!req.session.token || req.session.role !== 'admin') {
        return res.redirect('/login/admin')
    }
    try {
        res.render("admin/dashboard", { })
    } catch (error) {
        console.error('Error in admin index:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.get('/moradores', async (req, res) => {
    if(!!!req.session.token || req.session.role !== 'admin') {
        return res.redirect('/login/admin')
    }
    try {
        var moradores = await axios.get(API_URL + 'get-all-residents',
        { headers: { Authorization: `Bearer ${req.session.token}`}, 
        httpsAgent: agent })
        res.render("admin/moradores", { moradores: moradores.data })
    } catch (error) {
        console.error('Error in admin index:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.get('/moradores/new', async (req, res) => {
    if(!!!req.session.token || req.session.role !== 'admin') {
        return res.redirect('/login/admin')
    }
    try {
        res.render("admin/cadastro-moradores", { })
    } catch (error) {
        console.error('Error in admin index:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.post('/moradores/new', async (req, res) => {
    if(!!!req.session.token || req.session.role !== 'admin') {
        return res.redirect('/login/admin')
    }
    try {
        await axios.post(API_URL + 'register-resident', {
            FullName: req.body.Name,
            Rg: req.body.Rg,
            Cpf: req.body.Cpf,
            Street: req.body.street,
            Number: req.body.number,
            AditionalInfo: req.body.addInfo,
            LotNumber: req.body.lotNumber,
            Block: req.body.block
        }, { headers: { Authorization: `Bearer ${req.session.token}`}, httpsAgent: agent });
        res.redirect('/admin/moradores');
    } catch (error) {
        console.error('Error creating resident:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/mensagens', async (req, res) => {
    if(!!!req.session.token || req.session.role !== 'admin') {
        return res.redirect('/login/admin')
    }
    try {
        var messages = await axios.get(API_URL + 'get-all',
        { headers: { Authorization: `Bearer ${req.session.token}`}, httpsAgent: agent });
        res.render("admin/lista-mensagens", { mensagens: messages.data })
    } catch (error) {
        console.error('Error in admin index:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.get('/config', async (req, res) => {
    if(!!!req.session.token || req.session.role !== 'admin') {
        return res.redirect('/login/admin')
    }
    try {
        res.render("admin/configuracoes", { })
    } catch (error) {
        console.error('Error in admin index:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.post('/cadastro-conta', async (req, res) => {
    if(!!!req.session.token || req.session.role !== 'admin') {
        return res.redirect('/login/admin')
    }
    try {
        await axios.post(API_URL + 'create-account', {
            Email: req.body.email,
            Password: req.body.password,
            AccountType: req.body.accountType,
            IdResident: req.body.idResident
        }, { headers: { Authorization: `Bearer ${req.session.token}`}, httpsAgent: agent });
        res.redirect('/admin/config');
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;