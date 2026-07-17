import { Request, Response, NextFunction } from "express";
import product from "../models/product";
import ServerError from "../utils/server-error-class";

const isMongoDuplicateKey = (err: unknown): boolean =>
  Boolean(
    err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: number }).code === 11000
  );

const isValidationError = (err: unknown): boolean =>
  Boolean(
    err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "ValidationError"
  );

const normalizeProductBody = (body: Record<string, unknown>) => {
  const next = { ...body };
  if (typeof next.slug === "string") {
    next.slug = next.slug.trim();
  }
  return next;
};

const assertSlugAndSizes = (body: Record<string, unknown>) => {
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    throw ServerError.error400("Slug обязателен");
  }

  const sizes = body.sizes;
  if (!Array.isArray(sizes) || sizes.length < 1) {
    throw ServerError.error400("Добавьте хотя бы один размер");
  }
  const hasNamedSize = sizes.some(
    (s) =>
      s &&
      typeof s === "object" &&
      typeof (s as { name?: unknown }).name === "string" &&
      String((s as { name: string }).name).trim() !== ""
  );
  if (!hasNamedSize) {
    throw ServerError.error400("Добавьте хотя бы один размер");
  }
};

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
    const body = normalizeProductBody(req.body ?? {});
    assertSlugAndSizes(body);
    const doc = await product.create(body);
    return res.status(201).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isMongoDuplicateKey(err)) {
      return next(ServerError.error400("Товар с таким slug уже существует"));
    }
    if (isValidationError(err)) {
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
    const body = normalizeProductBody({ ...(req.body ?? {}) });
    delete body._id;
    delete body.__v;

    if ("slug" in body || "sizes" in body) {
      // For partial PATCH, load current doc to validate combined state
      const current = await product.findById(req.params.id).lean();
      if (!current) {
        return next(ServerError.error404("Товар не найден"));
      }
      assertSlugAndSizes({
        slug: body.slug ?? current.slug,
        sizes: body.sizes ?? current.sizes,
      });
    }

    const doc = await product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isMongoDuplicateKey(err)) {
      return next(ServerError.error400("Товар с таким slug уже существует"));
    }
    if (isValidationError(err)) {
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
