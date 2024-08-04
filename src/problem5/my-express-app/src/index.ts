import express from 'express';
import createError from 'http-errors';
import path from 'path';
import mongoose from 'mongoose';
import { create } from 'express-handlebars';
import resourceRouter from './routes/resource.routes';

const app = express();
const port = 3000;

const hbs = create({
  extname: 'hbs',
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home', { title: 'Problem 5' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/resource', resourceRouter);
app.use((req, res, next) => {
  next(createError(404));
});

mongoose
  .connect('mongodb+srv://NikitaV05:Magic_piano05@cluster0.waf5hpg.mongodb.net/Problem5?retryWrites=true&w=majority')
  .then((connection) => console.log("connected to " + connection.connection.name))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});