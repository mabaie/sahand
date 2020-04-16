"use strict";
const ExternalError = require("../Models/Error/External");
function authorization(checkercb) {
  return async function authorization(req, res, next) {
    if (req.get("Authorization")) {
      const parsed = req.get("Authorization").split(" ");
      if (parsed[0] == "Bearer") {
        const reqData = await checkercb(parsed[1]).catch(() => {
          next(new ExternalError(0));
        });
        req.data = reqData;
        next();
      } else {
        next(new ExternalError(0));
      }
    } else {
      next(new ExternalError(0));
    }
  };
}

module.exports = authorization;
