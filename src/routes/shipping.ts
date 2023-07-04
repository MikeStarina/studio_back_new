import { Router } from "express";
import { cdekCities } from "../controllers/cdekCities";
import { cdekDeliveryPoints } from "../controllers/cdekDeliveryPoints";
import { cdekCalculateDelivery } from "../controllers/cdekCalculateDelivery";

const router = Router();

router.get("/cities", cdekCities);
router.get("/points", cdekDeliveryPoints);
router.post("/calculate", cdekCalculateDelivery);

export default router;
