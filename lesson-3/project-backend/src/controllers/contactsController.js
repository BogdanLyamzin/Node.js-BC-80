import createHttpError from 'http-errors';

import Contact from '../db/models/Contact.js';

export const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOne({ _id: id });
  if (!contact) throw createHttpError(404, `Cannot find contact with id=${id}`);

  res.json(contact);
};
