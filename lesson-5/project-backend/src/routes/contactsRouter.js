import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../controllers/contactsController.js';

import {
  createContactSchema,
  updateContactSchema,
  contactIdSchema,
} from '../validations/contactsValidation.js';

const contactRouter = Router();

contactRouter.get('/', getContacts);

contactRouter.get(
  '/:id',
  celebrate(contactIdSchema, { abortEarly: false }),
  getContactById,
);

contactRouter.post(
  '/',
  // celebrate(createContactSchema, { abortEarly: false }),
  addContact,
);

contactRouter.patch(
  '/:id',
  celebrate(contactIdSchema, { abortEarly: false }),
  // celebrate(updateContactSchema, { abortEarly: false }),
  updateContactById,
);

contactRouter.delete(
  '/:id',
  celebrate(contactIdSchema, { abortEarly: false }),
  deleteContactById,
);

export default contactRouter;
