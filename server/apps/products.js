import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");

  const products = await collection.find({}).limit(10).toArray();

  return res.json({ data: products });
});

productRouter.get("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const collection = db.collection("products");

  const product = await collection.findOne({ _id: id });

  return res.json({ data: product });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");

  const { name, image, price, description, category } = req.body;
  if (!name ?? !image ?? !price ?? !description ?? !category) {
    return res.json({ message: "can't use this" });
  }

  const productData = { name, image, price, description, category };
  const products = await collection.insertOne(productData);

  return res.json({
    message: `product record (${products.insertedId})has been created successfully`,
  });
});

productRouter.put("/:productId", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.productId);

  const productData = { ...req.body };

  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: productData,
    }
  );

  return res.json({
    message: `Product record (${productId}) has been updated successfully`,
  });
});

productRouter.delete("/:productId", async (req, res) => {
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.productId);

  await collection.deleteOne({
    _id: productId,
  });

  return res.json({
    message: `Product record (${productId}) has been deleted successfully`,
  });
});

export default productRouter;
