import { Request, Response, NextFunction } from "express";
import product from "../models/product";
import ServerError from "../utils/server-error-class";

export const getProducts = async (req: Request, res: Response) => {
  const params = req.query;
  console.log("request");
  const products = await product.find({ ...params });
  return res.status(200).send({ data: products });
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await product.findById(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await product.create(req.body);
    return res.status(201).send({ data: doc });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "ValidationError"
    ) {
      return next(ServerError.error400("Некорректные данные товара"));
    }
    return next(ServerError.error500());
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = { ...(req.body ?? {}) };
    delete body._id;
    delete body.__v;
    const doc = await product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "ValidationError"
    ) {
      return next(ServerError.error400("Некорректные данные товара"));
    }
    return next(ServerError.error500());
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await product.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }
    return res.status(200).send({ message: "deleted", data: doc });
  } catch {
    return next(ServerError.error500());
  }
};
