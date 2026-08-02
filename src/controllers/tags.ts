import { Request, Response, NextFunction } from "express";
import tag from "../models/tag";
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

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

const assertTagBody = (body: Record<string, unknown>, partial = false) => {
  if (!partial || "label" in body) {
    const label = typeof body.label === "string" ? body.label.trim() : "";
    if (!label) {
      throw ServerError.error400("Название тега обязательно");
    }
  }
  if (!partial || "slug" in body || "label" in body) {
    const rawSlug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug
        : typeof body.label === "string"
          ? body.label
          : "";
    if (!slugify(rawSlug)) {
      throw ServerError.error400("Slug тега обязателен");
    }
  }
};

export const getTags = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await tag.find({}).sort({ order: 1, createdAt: 1 });
    return res.status(200).send({ data: docs });
  } catch {
    return next(ServerError.error500());
  }
};

export const getTagById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await tag.findById(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Тег не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const createTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = { ...(req.body ?? {}) };
    assertTagBody(body);
    const label = String(body.label).trim();
    const slug = slugify(
      typeof body.slug === "string" && body.slug.trim() ? body.slug : label
    );
    const doc = await tag.create({
      label,
      slug,
      order: Number(body.order) || 0,
    });
    return res.status(201).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isMongoDuplicateKey(err)) {
      return next(ServerError.error400("Тег с таким slug уже существует"));
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные тега"));
    }
    return next(ServerError.error500());
  }
};

export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = { ...(req.body ?? {}) };
    delete body._id;
    delete body.__v;
    assertTagBody(body, true);

    if (typeof body.label === "string") {
      body.label = body.label.trim();
    }
    if ("slug" in body || "label" in body) {
      const rawSlug =
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug
          : body.label;
      body.slug = slugify(String(rawSlug));
    }
    if ("order" in body) {
      body.order = Number(body.order) || 0;
    }

    const doc = await tag.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(ServerError.error404("Тег не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isMongoDuplicateKey(err)) {
      return next(ServerError.error400("Тег с таким slug уже существует"));
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные тега"));
    }
    return next(ServerError.error500());
  }
};

export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await tag.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Тег не найден"));
    }

    // Cascade: a deleted tag should disappear from every product that had it.
    await product.updateMany(
      { tags: doc._id },
      { $pull: { tags: doc._id } }
    );

    return res.status(200).send({ message: "Тег удален", data: doc });
  } catch {
    return next(ServerError.error500());
  }
};
