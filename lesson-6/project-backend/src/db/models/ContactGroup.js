import {Schema, model} from "mongoose";

import { handleMongooseError, setMongooseUpdateRules } from '../hooks.js';

const contactGroupSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  }
}, {versionKey: false, timestamps: true});

contactGroupSchema.post("save", handleMongooseError);

contactGroupSchema.pre("findOneAndUpdate", setMongooseUpdateRules);

contactGroupSchema.post("findOneAndUpdate", handleMongooseError);

const ContactGroup = model("contact-group", contactGroupSchema);

export default ContactGroup;
