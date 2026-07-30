import { Router } from 'express';

import {
  getContacts,
  getContactById,
} from '../controllers/contactsController.js';

const contactRouter = Router();

contactRouter.get('/', getContacts);

contactRouter.get('/:id', getContactById);

export default contactRouter;
