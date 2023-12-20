const path = require('path');
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const cors = require('cors');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const http = require('http');

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;
const base = process.env.BASE || '/';

// Create http server
const app = express()

// Session Cookies
const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

if (isProduction) {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  })

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Backend server listening on: http://localhost:' + PORT));
});
