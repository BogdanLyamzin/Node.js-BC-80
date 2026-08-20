import createHttpError from 'http-errors';

import ContactGroup from '../db/models/ContactGroup.js';
import Contact from '../db/models/Contact.js';

import { saveBufferToCloudinary } from '../services/cloudinary.js';

export const getContacts = async (req, res) => {
    const {_id: userId} = req.user;
  const { page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", group, search } = req.query;
  const skip = (page - 1) * perPage;
  const contactQuery = Contact.find();
  if(userId) {
    contactQuery.where("userId").equals(userId);
  }
  if(group) {
    contactQuery.where("group").equals(group);
  }
  if(search) {
    contactQuery.where({
      $or: [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          email: {
            $regex: search,
            $options: "i"
          }
        },
        {
          phone: {
            $regex: search,
            $options: "i"
          }
        }
      ]
    })
  }

  const [contacts, totalItems] = await Promise.all([
    contactQuery.clone().skip(skip).limit(perPage).sort({[sortBy]: sortOrder}).populate({
      path: 'group',
      select: 'name',
    }),
    contactQuery.countDocuments(),
  ]);

  const totalPages = Math.floor(totalItems / perPage);

  res.json({
    contacts,
    totalItems,
    totalPages,
    page,
    perPage,
  });
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const {_id: userId} = req.user;
  const contact = await Contact.findOne({ _id: id, userId });
  if (!contact) throw createHttpError(404, `Cannot find contact with id=${id}`);
  await contact.populate({
    path: 'group',
    select: 'name',
  });

  res.json(contact);
};

export const addContact = async (req, res) => {
  let photo = null;
  if(req.file) {
    const {secure_url} = await saveBufferToCloudinary({buffer: req.file.buffer, folder: "contacts"});
    photo = secure_url;
  }
  const group = await ContactGroup.exists({ _id: req.body.group });
  if (!group)
    throw createHttpError(404, `Cannot find group with id=${req.body.group}`);
  const {_id: userId} = req.user;
  const newContact = await Contact.create({...req.body, photo, userId});
  res.status(201).json(newContact);
};

export const updateContactById = async (req, res) => {
  const { id } = req.params;
  const {_id: userId} = req.user;
  const updateContact = await Contact.findOneAndUpdate({ _id: id, userId }, req.body);
  if (!updateContact)
    throw createHttpError(404, `Cannot find contact with id=${id}`);
  await updateContact.populate({
    path: 'group',
    select: 'name',
  });

  res.json(updateContact);
};

export const deleteContactById = async (req, res) => {
  const { id } = req.params;
  const {_id: userId} = req.user;
  const deleteContact = await Contact.findOneAndDelete({ _id: id, userId });
  if (!deleteContact)
    throw createHttpError(404, `Cannot find contact with id=${id}`);

  // res.status(204).send();
  res.json(deleteContact);
};
