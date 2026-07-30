import {Schema, model} from "mongoose";

const contactGroupSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  }
}, {versionKey: false, timestamps: true});

const ContactGroup = model("contact-group", contactGroupSchema);

export default ContactGroup;
