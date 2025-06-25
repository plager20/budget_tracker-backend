const router = require("express").Router();
const {
  getTransactionItems,
  createItem,
  deleteItem,
  editItem,
} = require("../controllers/transactionItems");
const { authorize } = require("../middlewares/auth");
const {
  validateTransactionBody,
  validateId,
} = require("../middlewares/validation");

router.get("/", getTransactionItems);
router.post("/", authorize, validateTransactionBody, createItem);
router.patch("/:itemId", authorize, validateTransactionBody, editItem);
router.delete("/:itemId", authorize, validateId, deleteItem);

module.exports = router;
