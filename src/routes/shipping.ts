import { Router } from "express";
import { cdekCities } from "../controllers/cdekCities";
import { cdekDeliveryPoints } from "../controllers/cdekDeliveryPoints";
import { cdekCalculateDelivery } from "../controllers/cdekCalculateDelivery";
import { cdekCreateOrder } from "../controllers/cdekCreateOrder";

const router = Router();

router.get("/cities", cdekCities);
router.get("/points", cdekDeliveryPoints);
router.post("/calculate", cdekCalculateDelivery);
router.post("/order", cdekCreateOrder);

export default router;
