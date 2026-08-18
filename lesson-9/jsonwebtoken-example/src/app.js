import jwt from "jsonwebtoken";
import "dotenv/config";

const {JWT_SECRET} = process.env;

const payload = {
    email: "balojed467@luhupo.com"
};

const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});
// console.log(token);
const decodeToken = jwt.decode(token);
// console.log(decodeToken)
try {
    const {email} = jwt.verify(token, JWT_SECRET);
    console.log(email);
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJhbG9qZWQ0NjdAbHVodXBvLmNvbSIsImlhdCI6MTc4NzA2ODI1MiwiZXhwIjoxNzg3MTU0NjUyfQ.AZDISFZn23az5ka8O_XHJokGKGYB0oIN_aMHp3K5z4s";
    jwt.verify(invalidToken, JWT_SECRET);
}
catch(error) {
    console.log(error.message);
}