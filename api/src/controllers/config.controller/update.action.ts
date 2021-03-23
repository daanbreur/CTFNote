import { Request, Response } from "express";
import { body } from "express-validator";
import PersistentConfiguration from "../../config/persitent";
import Rights from "../../config/rights";
import RightsManager from "../../utils/rights";
import SessionManager from "../../utils/session";
import IRoute from "../route";

const UpdateConfigAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    RightsManager.grantMiddleware([Rights.ADMIN_ALL]),
    body("md-create-url").optional(),
    body("md-show-url").optional(),
    body("allow-registration").optional().isBoolean(),
    body("store-flag").optional().isBoolean(),
  ],
  async action(req: Request, res: Response, next) {
    const {
      "md-create-url": mdCreateUrl,
      "md-show-url": mdShowUrl,
      "allow-registration": allowRegistration,
      "store-flag": storeFlag,
    } = req.body;

    if (mdCreateUrl != null) await PersistentConfiguration.set("md-create-url", mdCreateUrl, true);
    if (mdShowUrl != null) await PersistentConfiguration.set("md-show-url", mdShowUrl, true);
    if (allowRegistration != null) await PersistentConfiguration.set("allow-registration", allowRegistration, true);
    if (storeFlag != null) await PersistentConfiguration.set("store-flag", storeFlag, false);

    return res.status(200).json(await PersistentConfiguration.list());
  },
};

export default UpdateConfigAction;
