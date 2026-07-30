import createHttpError from 'http-errors';

import ContactGroup from "../db/models/ContactGroup.js";
import Contact from '../db/models/Contact.js';

export const getContacts = async (req, res) => {
  const contacts = await Contact.find().populate({
    path: "group",
    select: "name"
  });
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOne({ _id: id });
  if (!contact) throw createHttpError(404, `Cannot find contact with id=${id}`);
  await contact.populate({
    path: "group",
    select: "name"
  });

  res.json(contact);
};

export const addContact = async(req, res)=> {
  const group = await ContactGroup.exists({_id: req.body.group});
   if (!group) throw createHttpError(404, `Cannot find group with id=${req.body.group}`);

  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
}

export const updateContactById = async(req, res)=> {
  const { id } = req.params;
  const updateContact = await Contact.findOneAndUpdate({_id: id}, req.body, {returnDocument: "after"});
  if (!updateContact) throw createHttpError(404, `Cannot find contact with id=${id}`);
  await updateContact.populate({
    path: "group",
    select: "name"
  });

  res.json(updateContact);
}

export const deleteContactById = async(req, res)=> {
  const { id } = req.params;
  const deleteContact = await Contact.findOneAndDelete({_id: id});
  if (!deleteContact) throw createHttpError(404, `Cannot find contact with id=${id}`);

  // res.status(204).send();
  res.json(deleteContact);
}
