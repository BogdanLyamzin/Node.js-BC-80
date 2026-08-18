import { Router } from 'express';

import { getAllContactGroups, getContactGroupById, addContactGroup, updateContactGroupById } from '../controllers/contactGroupsController.js';

const contactGroupsRouter = Router();

contactGroupsRouter.get("/", getAllContactGroups);

contactGroupsRouter.get("/:id", getContactGroupById);

contactGroupsRouter.post("/", addContactGroup);

contactGroupsRouter.patch("/:id", updateContactGroupById);

export default contactGroupsRouter;
