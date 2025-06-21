const express = require('express');
const app = express();
const routes = require('./controllers/app');
const session = require('express-session')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sessions
app.use(session({ secret: 'rgregtrgtruytuth', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 * 60 * 24 * 2 } }))

//EJS
app.set('view engine', 'ejs')

app.use('/', routes);

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
})