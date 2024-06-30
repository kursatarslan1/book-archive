const express = require("express");
const router = express.Router();

const friendshipController = require("../controllers/friendship_controller");

router.use(express.json());

router.post("/friendship", friendshipController.SendRequest);
router.get("/friendship/:receiver_user_id", friendshipController.GetRequests);
router.get("/friendships/:current_user_id", friendshipController.GetFriendList);
router.put("/friendship/:receiver_user_id/:relation_id", friendshipController.ApproveRequest);
router.delete("/friendship/:receiver_user_id/:relation_id", friendshipController.RejectRequest);

module.exports = router;
