const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

const conn = require('./db/conn');

// Models
const Tought = require('./models/Tought');
const User = require('./models/User');

// Import Routes
const toughtsRouter = require('./routes/toughtsRouter');
const authRouter = require('./routes/authRouter');

// Controllers
const ToughtController = require('./controllers/ToughtsController');
const AuthController = require('./controllers/AuthController');

// Template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Recebeer resposta do body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// Flash messages
app.use(flash());

// Pasta publica
app.use(express.static('public'));

// Set session to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session;
    }
    next();
})

// Rotas
app.use('/toughts', toughtsRouter);
app.use('/', authRouter);

app.get('/', ToughtController.showToughts);

conn
    .sync({ force: false })
    .then(()=> {
        app.listen(3000);
}).catch((err)=> console.log(err));