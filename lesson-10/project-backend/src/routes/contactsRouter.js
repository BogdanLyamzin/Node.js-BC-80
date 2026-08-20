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
  getContactsSchema,
  createContactSchema,
  updateContactSchema,
  contactIdSchema,
} from '../validations/contactsValidation.js';

import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', celebrate(getContactsSchema), getContacts);

contactRouter.get(
  '/:id',
  celebrate(contactIdSchema, { abortEarly: false }),
  getContactById,
);

// upload.fields([{
//   name: "photo",
//   maxCount: 1
// }])
// upload.array("photo", 6);

contactRouter.post(
  '/',
  upload.single("photo"),
  celebrate(createContactSchema, { abortEarly: false }),
  addContact,
);

contactRouter.patch(
  '/:id',
  celebrate(contactIdSchema, { abortEarly: false }),
  celebrate(updateContactSchema, { abortEarly: false }),
  updateContactById,
);

contactRouter.delete(
  '/:id',
  celebrate(contactIdSchema, { abortEarly: false }),
  deleteContactById,
);

export default contactRouter;
