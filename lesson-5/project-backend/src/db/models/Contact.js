import { Schema, model } from 'mongoose';

import { emailRegexp, phoneRegexp } from '../../constants/index.js';

import { handleMongooseError, setMongooseUpdateRules } from '../hooks.js';

const contactSchema = new Schema({
  name: {
    type: String,
    minLength: 2,
    required: true,
  },
  email: {
    type: String,
    match: emailRegexp,
    required: true,
  },
  phone: {
    type: String,
    match: phoneRegexp,
    required: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "contact-group",
    required: true
  },
}, {versionKey: false, timestamps: true});

contactSchema.post("save", handleMongooseError);

contactSchema.pre("findOneAndUpdate", setMongooseUpdateRules);

contactSchema.post("findOneAndUpdate", handleMongooseError);

const Contact = model('contact', contactSchema);

export default Contact;
