import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const newProducts = await collection.find({}, { $limit: 10 }).toArray();
  return res.json({
    message: "Get products successfully.",
    data: newProducts,
  });
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  const newProduct = await collection.findOne({
    _id: id,
  });

  return res.json({
    message: "Get product successfully.",
    data: newProduct,
  });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const productsData = { ...req.body };
  if (
    !req.body.name ||
    !req.body.image ||
    !req.body.price ||
    !req.body.description ||
    !req.body.category
  ) {
    return res.status(404).json({
      message: "Error can't find body.",
    });
  }

  const result = await collection.insertOne(productsData);

  return res.json({
    message: `Product record (${result.insertedId}) has been created successfully`,
  });
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  const newProduct = { ...req.body };
  const result = await collection.updateOne({ _id: id }, { $set: newProduct });

  return res.json({
    message: "Product has been updated successfully",
  });
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  const result = await collection.deleteOne({ _id: id });
  return res.json({
    message: `Delete item on id : ${id} successfully `,
  });
});

export default productRouter;
