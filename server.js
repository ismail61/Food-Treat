const {
  express,
  app,
  ejs,
  path,
  expressLayouts,
  mongoose,
  session,
  flash,
  ck,
  MongoDbStore,
  passport,
  Events
} = require("./require/requires");

//Database Connection
require("./require/database");
//Session Store
const session_store = new MongoDbStore({
  mongooseConnection : mongoose.connection,
  collection : 'sessions',

})
//Event Emitter
var Emitter = require('events')
var eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)
//middleware
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({ extended : true}))

//session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    store : session_store,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //24 hour
    },
  })
);
//passport config
require('./app/config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

//global middleware
app.use((req,res,next)=>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

//ejs setup
app.use(expressLayouts);
app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "ejs");

require("./routes/routes")(app);

const PORT = process.env.PORT || 4444;
const Server = app.listen(PORT, () => {
  console.log(`server at running at port ${PORT}`);
});


// socket io
const io = require('socket.io')(Server)
require('socket.io-client')

io.on('connection', function(socket) {

  //console.log('Client connected.')
  
  socket.on('order',orderId=> {
    //console.log(orderId)
    socket.join(orderId)
  })
  
  socket.on('adminJoin',room=> {
    //console.log(orderId)
    socket.join(room)
  })

})

//receive event emitter

eventEmitter.on('orderUpdated',data=>{
  //console.log(data)
  //sending to all clients in orderId room except sender
  io.to(data.id).emit('againOrderUpdated',data)
})

//admin
eventEmitter.on('orderPlaced',data=>{
  //sending to all clients in "adminRoom" room except sender
  io.to('adminRoom').emit('orderPlacedInAdmin',data)
})
eventEmitter.on('orderHome',data=>{
  //sending to all clients in "adminRoom" room except sender
  console.log(data)
})