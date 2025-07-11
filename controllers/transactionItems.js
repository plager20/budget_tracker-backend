const transactionItem = require("../models/transactionItem");
const TransactionItems = require("../models/transactionItem");
const BadRequestError = require("../errors/badrequest");
const NotFoundError = require("../errors/notfound");
const ForbiddenError = require("../errors/forbidden");

const getTransactionItems = (req, res, next) => {
  TransactionItems.find({})
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => next(err));
};

const createItem = async (req, res, next) => {
  const { name, amount, type } = req.body;
  const owner = req.user._id;

  try {
    const item = await TransactionItems.create({ name, amount, type, owner });
    console.log(item);
    res.status(201).send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid request"));
    }
    return next(err);
  }
};

const editItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    const updateData = req.body; // the fields to update

    if (!itemId) {
      return next(new BadRequestError("Item Id is required"));
    }

    const item = await transactionItem.findById(itemId).orFail();

    if (!item.owner.equals(userId)) {
      return next(
        new ForbiddenError("You are not authorized to perform this action.")
      );
    }

    const updatedItem = await transactionItem.findByIdAndUpdate(
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

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  transactionItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return next(
          new ForbiddenError("You are not authorized to perorm this action.")
        );
      }
      return transactionItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          return next(new NotFoundError("Item not found"));
        }
        if (!itemId) {
          return next(new BadRequestError("Item Id is required"));
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
