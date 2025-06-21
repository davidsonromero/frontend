const express = require('express')
const router = express.Router()
const axios = require('axios')

const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const API_URL = 'https://localhost:44394/'

router.get('/', (req, res) => {
    res.render("login/index", {})
});

router.get('/admin', (req, res) => {
    res.render("login/admin_login", {})
});

router.post('/auth-resident', async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await axios.post(`${API_URL}auth-resident`, {email, password}, {httpsAgent: agent});
        if(!response.data.success) {
            res.status(401).send('Invalid email or password');
        }
        req.session.token = response.data.token;
        req.session.email = email;
        req.session.role = 'resident';
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during resident login:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/auth-admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await axios.post(`${API_URL}auth-admin`, {email, password}, {httpsAgent: agent});
        if(!response.data.success) {
            res.status(401).send('Invalid email or password');
        }
        req.session.token = response.data.token;
        req.session.email = email;
        req.session.role = 'admin';
        res.redirect('/admin');
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

module.exports = router