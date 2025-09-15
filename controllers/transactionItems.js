const TransactionItem = require("../models/transactionItem");
const BadRequestError = require("../errors/badrequest");
const NotFoundError = require("../errors/notfound");
const ForbiddenError = require("../errors/forbidden");

// GET all items
const getTransactionItems = (req, res, next) => {
  TransactionItem.find({})
    .then((items) => {
      console.log("Items gotten!");
      res.status(200).send(items);
    })
    .catch((err) => next(err));
};

// CREATE item
const createItem = async (req, res, next) => {
  const { name, amount, category, type } = req.body;
  const owner = req.user._id;

  try {
    console.log("Creating item with:", { name, amount, type, category, owner });
    const item = await TransactionItem.create({
      name,
      amount,
      category,
      type,
      owner,
    });
    console.log("Item Created: ", item);
    res.status(201).send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid request"));
    }
    return next(err);
  }
};

// EDIT item
const editItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    const updateData = req.body;

    if (!itemId) {
      return next(new BadRequestError("Item Id is required"));
    }

    const item = await TransactionItem.findById(itemId).orFail();

    if (!item.owner.equals(userId)) {
      return next(
        new ForbiddenError("You are not authorized to perform this action.")
      );
    }

    const updatedItem = await TransactionItem.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).send({
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    return next(err);
  }
};

// DELETE item
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  TransactionItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return next(
          new ForbiddenError("You are not authorized to perform this action.")
        );
      }
      return TransactionItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          return next(new NotFoundError("Item not found"));
        }
        return res
          .status(200)
          .send({ message: "Item deleted successfully", data: deletedItem });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
    });
};

module.exports = {
  getTransactionItems,
  createItem,
  editItem,
  deleteItem,
};
