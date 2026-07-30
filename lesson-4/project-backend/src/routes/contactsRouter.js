import { Router } from 'express';

import {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../controllers/contactsController.js';

const contactRouter = Router();

contactRouter.get('/', getContacts);

contactRouter.get('/:id', getContactById);

contactRouter.post("/", addContact);

contactRouter.patch("/:id", updateContactById);

contactRouter.delete("/:id", deleteContactById);

export default contactRouter;
