import express from 'express';
import cors from "cors";
import PinoHttp from 'pino-http';
import "dotenv/config";
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const contactsPath = resolve('src', 'contacts.json');

const getAllContacts = async () => {
  const data = await readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const app = express(); // app - web-server

// const corsMiddleware = cors();
// app.use(corsMiddleware)
app.use(cors());
const logger = PinoHttp({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
      hideObject: true,
      messageFormat: "{req.method} {req.url} {res.statusCode} - {responseTime}ms"
    }
  }
});
app.use(logger);

// app.use((req, res, next)=> {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
//   next();
// })

// app.use((req, res, next)=> {
//   console.log("First middleware");
//   next();
// })

// app.use((req, res, next)=> {
//   console.log("Second middleware");
//   next();
// })

// app.set('json spaces', 8);

app.get('/', (request, response) => {
  console.log(request.method);
  response.send('<h1>Home page</h1>');
});

app.get('/contacts', async (req, res) => {
  const contacts = await getAllContacts();
  // const databaseResponse = null;
  // res.json(databaseResponse);
  // res.send(databaseResponse);
  res.json(contacts);
  // res.send(contacts);
});

app.get('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const contacts = await getAllContacts();
  const normalizedId = Number(id);
  const contact = contacts.find((item) => item.id === normalizedId);
  res.json(contact);
});

app.use((req, res)=> {
  res.status(404).json({
    message: `${req.method} ${req.url} not found`
  })
})

app.use((error, req, res, next)=> {
  const isProd = process.env.NODE_ENV === "production";
  const message = isProd ? "Some error" : error.message;
  res.status(500).json({
    message,
  })
})

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => console.log(`Server running on ${port} port`));
