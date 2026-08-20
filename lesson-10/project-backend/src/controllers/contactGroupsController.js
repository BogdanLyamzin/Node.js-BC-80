import createHttpError from "http-errors";

import Contact from "../db/models/Contact.js";
import ContactGroup from "../db/models/ContactGroup.js";

export const getAllContactGroups = async(req, res)=> {
  const contactGroups = await ContactGroup.find();
  res.json(contactGroups);
}

export const getContactGroupById = async(req, res)=> {
  const {id} = req.params;
  const contactGroup = await ContactGroup.findOne({_id: id});
  if(!contactGroup) throw new createHttpError(404, `Cannot find contact-group with id={$id}`);

  res.json(contactGroup);
}

export const addContactGroup = async(req, res)=> {
  const newContactGroup = await ContactGroup.create(req.body);
  res.status(201).json(newContactGroup)
}

export const updateContactGroupById = async(req, res)=> {
  const {id} = req.params;
  const updateContactGroup = await ContactGroup.findOneAndUpdate({_id: id}, req.body, {returnDocument: "after"});
  if(!updateContactGroup) throw new createHttpError(404, `Cannot find contact-group with id={$id}`);

  res.json(updateContactGroup);
}

export const deleteContactGroupById = async(req, res)=> {
  const {id} = req.params;
  const contact = await Contact.exists({group: id});
  if(contact) throw new createHttpError(400, `Cannot delete contact-group because in database exist contacts with this group`);
  
  const deleteContactGroup = await ContactGroup.findOneAndDelete({_id: id}, req.body);
  if(!deleteContactGroup) throw new createHttpError(404, `Cannot find contact-group with id={$id}`);

  res.json(deleteContactGroup);
}

