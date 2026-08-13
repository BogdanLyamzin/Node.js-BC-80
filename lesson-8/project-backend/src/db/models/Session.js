import { Schema, model } from 'mongoose';

import { handleMongooseError, setMongooseUpdateRules } from '../hooks.js';

const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
   refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
}, {versionKey: false, timestamps: true});

sessionSchema.post("save", handleMongooseError);

sessionSchema.pre("findOneAndUpdate", setMongooseUpdateRules);

sessionSchema.post("findOneAndUpdate", handleMongooseError);

const Session = model("session", sessionSchema);

export default Session;
