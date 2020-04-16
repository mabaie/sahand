"use strict";
"use strict";
const authorization = require("../../../../middlewares/authorization");
const managerAuthorization = require("../../../../services/authorizators/manager");
const termListGetController = "";
const router = require("express").Router();

router.get(
    "/grade-list",
    authorization(managerAuthorization),
    termListGetController
  );
module.exports = router;