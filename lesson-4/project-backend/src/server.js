import express from 'express';
import cors from 'cors';

import 'dotenv/config';

import logger from './middlewares/logger.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

import contactGroupsRouter from './routes/contactGroupsRouter.js';
import contactRouter from './routes/contactsRouter.js';

import connectDatabase from './db/connectDatabase.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/contact-groups", contactGroupsRouter);
app.use('/contacts', contactRouter);

app.use(notFoundHandler);
app.use(errorHandler);

await connectDatabase();
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => console.log(`Server running on ${port} port`));
