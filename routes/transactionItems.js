const router = require("express").Router();
const {
  getTransactionItems,
  createItem,
  deleteItem,
} = require("../controllers/transactionItems");
const { authorize } = require("../middlewares/auth");
const {
  validateTransactionBody,
  validateId,
} = require("../middlewares/validation");

router.get("/", getTransactionItems);
router.post("/", authorize, validateTransactionBody, createItem);
router.delete("/:itemId", authorize, validateId, deleteItem);

module.exports = router;
