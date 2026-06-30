---
name: new-domain-module
description: Scaffold a new backend domain module for the My Doctor Express API. Triggers on "create a new module", "add a new domain", "scaffold the X module", "add X to the backend". Generates the exact 4-file MVC structure used by all 25+ existing modules, wires it into routes.ts, and creates the Joi validator.
metadata:
  priority: 10
  pathPatterns:
    - "apps/server/src/modules/**"
    - "apps/server/src/routes/routes.ts"
---

# New Domain Module — My Doctor Backend

Every domain in this codebase follows a **strict 4-file pattern**. Never hand-roll a module without following it exactly.

## File structure

```
apps/server/src/modules/{domain}/
  {Domain}.model.ts       ← Mongoose schema + TypeScript interface
  {Domain}.service.ts     ← Static class with business logic
  {Domain}.controller.ts  ← Named-export request handlers
  {Domain}.routes.ts      ← Express Router with middleware chain
apps/server/src/validators/{domain}.validator.ts   ← Joi schema(s)
```

## Naming convention

- Folder: kebab-case plural (`doctor-schedules`, `guide-bookings`)
- Files: PascalCase singular prefix (`DoctorSchedules.model.ts`)
- Module name in routes.ts: kebab-case plural (`/doctor-schedules`)

## 1. Model (`{Domain}.model.ts`)

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface I{Domain} extends Document {
  // fields...
  createdAt: Date;
  updatedAt: Date;
}

const {Domain}Schema: Schema = new Schema(
  {
    // fields
  },
  { timestamps: true }
);

const {Domain} = mongoose.model<I{Domain}>('{Domain}', {Domain}Schema);
export default {Domain};
```

Rules:
- Always `{ timestamps: true }`
- Ref fields use `type: mongoose.Types.ObjectId, ref: 'CollectionName'`
- Index fields that will be filtered/sorted
- Add `unique: true, sparse: true` on slug fields

## 2. Service (`{Domain}.service.ts`)

```typescript
import createError from 'http-errors';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';
import {Domain} from './{Domain}.model.js';

class {Domain}Service {
  static async Create(payload: unknown) {
    return await {Domain}.create(payload);
  }

  static async GetAll(filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const [data, total] = await Promise.all([
      {Domain}.find().skip(skip).limit(limit).lean(),
      {Domain}.countDocuments(),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(id: string) {
    const doc = await {Domain}.findById(id).lean();
    if (!doc) throw createError.NotFound('{Domain} not found');
    return doc;
  }

  static async Update(id: string, payload: unknown) {
    const doc = await {Domain}.findByIdAndUpdate(id, payload, { new: true });
    if (!doc) throw createError.NotFound('{Domain} not found');
    return doc;
  }

  static async Delete(id: string) {
    const doc = await {Domain}.findByIdAndDelete(id);
    if (!doc) throw createError.NotFound('{Domain} not found');
    return doc;
  }
}

export default {Domain}Service;
```

Rules:
- Static class only — never instantiate
- Throw `createError.*` for domain errors (404, 409, etc.)
- All local imports use `.js` extension
- Use `parsePagination` + `buildMeta` for paginated lists
- `lean()` on read-only queries for performance

## 3. Controller (`{Domain}.controller.ts`)

```typescript
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse.js';
import {Domain}Service from './{Domain}.service.js';

export const Create{Domain} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await {Domain}Service.Create(req.body);
    return sendResponse(res, data, '{Domain} created successfully', 201);
  } catch (e) {
    next(e);
  }
};

export const GetAll{Domain}s = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await {Domain}Service.GetAll(req.query);
    return sendResponse(res, data, '{Domain}s fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const Get{Domain}ById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await {Domain}Service.GetById(req.params.id);
    return sendResponse(res, data, '{Domain} fetched successfully');
  } catch (e) {
    next(e);
  }
};

export const Update{Domain} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await {Domain}Service.Update(req.params.id, req.body);
    return sendResponse(res, data, '{Domain} updated successfully');
  } catch (e) {
    next(e);
  }
};

export const Delete{Domain} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await {Domain}Service.Delete(req.params.id);
    return sendResponse(res, data, '{Domain} deleted successfully');
  } catch (e) {
    next(e);
  }
};
```

Rules:
- Named exports only (no default export)
- Every handler: `try { ... } catch (e) { next(e); }`
- **Never** call `res.json()` directly — always `sendResponse()`
- File upload handlers: `if (req.file) payload.photo = \`/uploads/${req.file.filename}\``
- Auth-required handlers use `AuthRequest` from `jwt_helper.js`, extract `req.payload?.aud`

## 4. Routes (`{Domain}.routes.ts`)

```typescript
import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import { protect } from '../../middlewares/shared/protect.js';
import { validate } from '../../validators/validate.middleware.js';
import { create{Domain}Schema, update{Domain}Schema } from '../../validators/{domain}.validator.js';
import * as {Domain}Controller from './{Domain}.controller.js';

const router: express.Router = express.Router();

router.get('/', {Domain}Controller.GetAll{Domain}s);
router.get('/:id', {Domain}Controller.Get{Domain}ById);
router.post('/', verifyAccessToken, protect(['admin']), validate(create{Domain}Schema), {Domain}Controller.Create{Domain});
router.patch('/:id', verifyAccessToken, protect(['admin']), validate(update{Domain}Schema), {Domain}Controller.Update{Domain});
router.delete('/:id', verifyAccessToken, protect(['admin']), {Domain}Controller.Delete{Domain});

export default router;
```

Middleware chain order (MUST follow this exactly):
```
verifyAccessToken → protect(['role']) → upload.single('field') → validate(schema) → Controller.Method
```

- `upload` must come BEFORE `validate` — multer populates `req.body` first
- Public endpoints skip auth middleware entirely
- Roles: `'admin'`, `'doctor'`, `'customer'`

## 5. Validator (`src/validators/{domain}.validator.ts`)

```typescript
import Joi from 'joi';

export const create{Domain}Schema = Joi.object({
  // required fields
  name: Joi.string().trim().min(1).max(200).required(),
  // optional fields
  description: Joi.string().trim().max(1000).optional(),
});

export const update{Domain}Schema = Joi.object({
  name: Joi.string().trim().min(1).max(200).optional(),
  description: Joi.string().trim().max(1000).optional(),
}).min(1); // at least one field required
```

## 6. Register in `routes.ts`

Add to `apps/server/src/routes/routes.ts`:
```typescript
import {Domain}Routes from '../modules/{domain}/{Domain}s.routes.js';
// ...
router.use('/{domain}s', {Domain}Routes);
```

## Checklist

- [ ] All 4 module files created
- [ ] Validator file created in `src/validators/`
- [ ] Route registered in `src/routes/routes.ts`
- [ ] All internal imports have `.js` extension
- [ ] No `res.json()` calls in controller — only `sendResponse()`
- [ ] No `any` types on public service method signatures
- [ ] Run `pnpm typecheck` from `apps/server/`
