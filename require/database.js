const {mongoose} = require('./requires')

const url = 'mongodb://localhost:27017/food';
//const url = 'mongodb+srv://root:<password61@>@database.dcg2q.mongodb.net/<test>?retryWrites=true&w=majority';
mongoose.connect(url,{
    useNewUrlParser:true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify:false
})
//const connection = mongoose.connection;
mongoose.connection.on('connected', () => {
  console.log('Connected to database ');
}); 

mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});