export const handleMongooseError = (error, doc, next)=> {
  error.status = 400;
  next(error);
};

export const setMongooseUpdateRules = function() {
  this.setOptions({
    runValidators: true,
    returnDocument: "after"
  })
};
