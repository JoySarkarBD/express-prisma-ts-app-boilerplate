# Resource Generator CLI & Prisma ORM

## Overview

The Resource Generator CLI is a command-line tool designed to streamline the creation of resource-related files in a Node.js project. It automatically generates route, model, controller, interface, and validation files based on a specified resource name. This tool helps maintain consistency and speed up development by creating boilerplate code for new resources.

## Features

- **Generate Controller Files**: Create controller files with basic CRUD operations and response handling.
- **Generate Route Files**: Create route files with standard RESTful endpoints for the specified resource.
- **Generate Service Files**: Create service files include standard RESTful endpoints for managing resources.
- **Generate Validation Files**: Create Zod validation schemas and middleware for request validation.

## Installation

**To use the CLI tool, clone the repository and install the dependencies.**

```bash
git clone <repository-url>
cd <repository-directory>
```

**To install dependencies using npm**:

```bash
npm install
```

**To install dependencies using Yarn**:

```bash
yarn install
```

**To install dependencies using pnpm**:

```bash
pnpm install
```

## Prisma Integration Guide

The Resource Generator CLI supports Prisma for managing database interactions. Follow these steps to integrate Prisma with your generated resources effectively.

### Prisma Setup

#### 1. Initialize Prisma

To get started with Prisma, initialize it in your project. This step creates a `prisma` directory with a `schema.prisma` file.

- **Using npx:**

  ```bash
  npx prisma init
  ```

- **Using Yarn:**

  ```bash
  yarn prisma init
  ```

- **Using pnpm:**

  ```bash
  pnpm prisma init
  ```

#### 2. Configure Prisma Schema

Open the `prisma/schema.prisma` file and define your data models. For example, to define a `Blog` model, you might use the following configuration:

```prisma
model Blog {
  id     String @id @default(cuid())
  title  String
  // Add other fields as needed
}
```

Customize the schema according to your project's requirements. You can define multiple models and relationships between them.

#### 3. Generate Prisma Client

After configuring your schema, generate the Prisma Client. This client provides a type-safe query builder for interacting with your database.

- **Using npx:**

  ```bash
  npx prisma generate
  ```

- **Using Yarn:**

  ```bash
  yarn prisma generate
  ```

- **Using pnpm:**

  ```bash
  pnpm prisma generate
  ```

This command creates the Prisma Client in the `node_modules/@prisma/client` directory.

#### 4. Prisma Migrations

Prisma Migrations help you manage changes to your database schema over time. Use the following commands to create and apply migrations:

##### Create a Migration

- **Using npx:**

  ```bash
  npx prisma migrate dev --name <migration-name>
  ```

- **Using Yarn:**

  ```bash
  yarn prisma migrate dev --name <migration-name>
  ```

- **Using pnpm:**

  ```bash
  pnpm prisma migrate dev --name <migration-name>
  ```

Replace `<migration-name>` with a descriptive name for your migration.

## The customized resource generating CLI tool can be executed using the following command(direct resource):

**By using npm**:

```bash
npm run resource <resource-name>
```

**By using yarn**:

```bash
yarn run resource <resource-name>
```

**By using pnpm**:

```bash
pnpm run resource <resource-name>
```

### Command Arguments

- `<resource-name>`: The name of the resource for which you want to generate files. This will be converted to lowercase and used to create file names and paths.

### Example

To generate files for a resource named `blog`, run:

```bash
npm run resource blog
```

This will create the following files:

- **Controller File**: `src/modules/blog/blog.controller.ts`
- **Route File**: `src/modules/blog/blog.route.ts`
- **Service File**: `src/modules/blog/blog.service.ts`
- **Validation File**: `src/modules/blog/blog.validation.ts`

## File Structure

### Controller File (`blog.controller.ts`)

Contains controller functions for handling HTTP requests, including:

- `createBlog`
- `createManyBlogs`
- `updateBlog`
- `updateManyBlogs`
- `deleteBlog`
- `deleteManyBlogs`
- `getBlogById`
- `getManyBlogs`

### Route File (`blog.route.ts`)

Defines RESTful routes for the resource, including endpoints for creating, updating, deleting, and retrieving resources.

### Service File (`blog.service.ts`)

The `blog.service.ts` file contains service functions for managing blog resources in the application. These functions interact with the `BlogModel` to perform CRUD (Create, Read, Update, Delete) operations on blog data.

### Validation File (`blog.validation.ts`)

Includes Zod validation schemas and middleware functions for validating requests. The validation file ensures that IDs and other required fields are valid.

## Example Files

### Controller File Example

```typescript
import { Request, Response } from 'express';
import { blogServices } from './blog.service';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single Blog.
 *
 * @param {Request} req - The request object containing blog data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createBlog = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new blog and get the result
  const result = await blogServices.createBlog(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Blog created successfully', result);
});

/**
 * Controller function to handle the creation of multiple blog.
 *
 * @param {Request} req - The request object containing an array of blog data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createManyBlog = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple blogs and get the result
  const result = await blogServices.createManyBlog(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single blog.
 *
 * @param {Request} req - The request object containing the ID of the blog to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the blog by ID and get the result
  const result = await blogServices.updateBlog(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Blog updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple blog.
 *
 * @param {Request} req - The request object containing an array of blog data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateManyBlog = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple blog and get the result
  const result = await blogServices.updateManyBlog(req.body);
  // Send a success response with the updated resources data
  ServerResponse(res, true, 200, 'Resources updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single blog.
 *
 * @param {Request} req - The request object containing the ID of the blog to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the blog by ID
  await blogServices.deleteBlog(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Blog deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple blog.
 *
 * @param {Request} req - The request object containing an array of IDs of blog to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyBlog = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple blog and get the result
  await blogServices.deleteManyBlog(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single blog by ID.
 *
 * @param {Request} req - The request object containing the ID of the blog to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the blog by ID and get the result
  const result = await blogServices.getBlogById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Blog retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple blog.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getManyBlog = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple blog based on query parameters and get the result
  const result = await blogServices.getManyBlog(req.query);
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});
```

### Route File Example

```typescript
// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createBlog,
  createManyBlog,
  updateBlog,
  updateManyBlog,
  deleteBlog,
  deleteManyBlog,
  getBlogById,
  getManyBlog,
} from './blog.controller';

//Import validation from corresponding module
import {
  validateCreateBlog,
  validateCreateManyBlog,
  validateUpdateBlog,
  validateUpdateManyBlog,
} from './blog.validation';
import { validateId, validateIds } from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/blog/create-blog
 * @description Create a new blog
 * @access Public
 * @param {function} controller - ['createBlog']
 * @param {function} validation - ['validateCreateBlog']
 */
router.post('/create-blog', validateCreateBlog, createBlog);

/**
 * @route POST /api/v1/blog/create-blog/many
 * @description Create multiple blog
 * @access Public
 * @param {function} controller - ['createManyBlog']
 * @param {function} validation - ['validateCreateManyBlog']
 */
router.post('/create-blog/many', validateCreateManyBlog, createManyBlog);

/**
 * @route PUT /api/v1/blog/update-blog/many
 * @description Update multiple blog information
 * @access Public
 * @param {function} controller - ['updateManyBlog']
 * @param {function} validation - ['validateIds', 'validateUpdateManyBlog']
 */
router.put('/update-blog/many', validateIds, validateUpdateManyBlog, updateManyBlog);

/**
 * @route PUT /api/v1/blog/update-blog/:id
 * @description Update blog information
 * @param {string} id - The ID of the blog to update
 * @access Public
 * @param {function} controller - ['updateBlog']
 * @param {function} validation - ['validateId', 'validateUpdateBlog']
 */
router.put('/update-blog/:id', validateId, validateUpdateBlog, updateBlog);

/**
 * @route DELETE /api/v1/blog/delete-blog/many
 * @description Delete multiple blog
 * @access Public
 * @param {function} controller - ['deleteManyBlog']
 * @param {function} validation - ['validateIds']
 */
router.delete('/delete-blog/many', validateIds, deleteManyBlog);

/**
 * @route DELETE /api/v1/blog/delete-blog/:id
 * @description Delete a blog
 * @param {string} id - The ID of the blog to delete
 * @access Public
 * @param {function} controller - ['deleteBlog']
 * @param {function} validation - ['validateId']
 */
router.delete('/delete-blog/:id', validateId, deleteBlog);

/**
 * @route POST /api/v1/blog/get-blog/many
 * @description Get multiple blog
 * @access Public
 * @param {function} controller - ['getManyBlog']
 * @param {function} validation - ['validateIds']
 */
router.post('/get-blog/many', validateIds, getManyBlog);

/**
 * @route GET /api/v1/blog/get-blog/:id
 * @description Get a blog by ID
 * @param {string} id - The ID of the blog to retrieve
 * @access Public
 * @param {function} controller - ['getBlogById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-blog/:id', validateId, getBlogById);

// Export the router
module.exports = router;
```

### Service File Example

```typescript
import { Prisma } from '@prisma/client';

// Import the Prisma Client instance
import { prismaClient } from '../../index';

/**
 * Service function to create a new blog.
 *
 * @param data - The data to create a new blog.
 * @returns {Promise<Blog>} - The created blog.
 */
const createBlog = async (data: Prisma.BlogCreateInput) => {
  return await prismaClient.blog.create({ data });
};

/**
 * Service function to create multiple blog.
 *
 * @param data - An array of data to create multiple blog.
 * @returns {Promise<Blog[]>} - The created blog.
 */
const createManyBlog = async (data: Prisma.BlogCreateManyInput[]) => {
  return await prismaClient.blog.createMany({ data });
};

/**
 * Service function to update a single blog by ID.
 *
 * @param id - The ID of the blog to update.
 * @param data - The updated data for the blog.
 * @returns {Promise<Blog>} - The updated blog.
 */
const updateBlog = async (id: string, data: Prisma.BlogUpdateInput) => {
  return await prismaClient.blog.update({
    where: { id },
    data,
  });
};

/**
 * Service function to update multiple blog.
 *
 * @param data - An array of data to update multiple blog.
 * @returns {Promise<Blog[]>} - The updated blog.
 */
const updateManyBlog = async (data: { id: string; updates: Prisma.BlogUpdateInput }[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    prismaClient.blog.update({
      where: { id },
      data: updates,
    })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single blog by ID.
 *
 * @param id - The ID of the blog to delete.
 * @returns {Promise<Blog>} - The deleted blog.
 */
const deleteBlog = async (id: string) => {
  return await prismaClient.blog.delete({
    where: { id },
  });
};

/**
 * Service function to delete multiple blog.
 *
 * @param ids - An array of IDs of blog to delete.
 * @returns {Promise<Blog[]>} - The deleted blog.
 */
const deleteManyBlog = async (ids: string[]) => {
  return await prismaClient.blog.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

/**
 * Service function to retrieve a single blog by ID.
 *
 * @param id - The ID of the blog to retrieve.
 * @returns {Promise<Blog>} - The retrieved blog.
 */
const getBlogById = async (id: string) => {
  return await prismaClient.blog.findUnique({
    where: { id },
  });
};

/**
 * Service function to retrieve multiple blog based on query parameters.
 *
 * @param query - The query parameters for filtering blog.
 * @returns {Promise<Blog[]>} - The retrieved blog.
 */
const getManyBlog = async (query: Prisma.BlogWhereInput) => {
  return await prismaClient.blog.findMany({
    where: query,
  });
};

export const blogServices = {
  createBlog,
  createManyBlog,
  updateBlog,
  updateManyBlog,
  deleteBlog,
  deleteManyBlog,
  getBlogById,
  getManyBlog,
};
```

### Validation File Example

```typescript
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating blog data during creation.
 */
const zodCreateBlogSchema = z
  .object({
    // Define fields required for creating a new blog.
    // Example:
    // filedName: z.string({ required_error: 'Please provide a filedName.' }).min(1, "Can't be empty."),
  })
  .strict();

/**
 * Middleware function to validate blog creation data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateCreateBlog = (req: Request, res: Response, next: NextFunction) => {
  // Validate the request body for creating a new blog
  const parseResult = zodCreateBlogSchema.safeParse(req.body);

  // If validation fails, send an error response using the Zod error handler
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }

  // If validation passes, proceed to the next middleware function
  return next();
};

/**
 * Zod schema for validating multiple blog data during creation.
 */
const zodCreateManyBlogSchema = z.array(zodCreateBlogSchema);

/**
 * Middleware function to validate multiple blog creation data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateCreateManyBlog = (req: Request, res: Response, next: NextFunction) => {
  const parseResult = zodCreateManyBlogSchema.safeParse(req.body);
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }
  return next();
};

/**
 * Zod schema for validating blog data during updates.
 */
const zodUpdateBlogSchema = z
  .object({
    // Define fields required for updating an existing blog.
    // Example:
    // fieldName: z.string({ required_error: 'Please provide a filedName.' }).optional(), // Fields can be optional during updates
  })
  .strict();

/**
 * Middleware function to validate blog update data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateUpdateBlog = (req: Request, res: Response, next: NextFunction) => {
  // Validate the request body for updating an existing blog
  const parseResult = zodUpdateBlogSchema.safeParse(req.body);

  // If validation fails, send an error response using the Zod error handler
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }

  // If validation passes, proceed to the next middleware function
  return next();
};

/**
 * Zod schema for validating multiple blog data during updates.
 */
const zodUpdateManyBlogSchema = z.array(zodUpdateBlogSchema);

/**
 * Middleware function to validate multiple blog update data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateUpdateManyBlog = (req: Request, res: Response, next: NextFunction) => {
  const parseResult = zodUpdateManyBlogSchema.safeParse(req.body);
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }
  return next();
};
```

---

**It will act same like the previous command but it will generate the resources as nested you want.**

## Contact

For any questions or feedback, please contact [JoySarkar] at [developer.joysarkar@gmail.com].

Feel free to adjust any sections to better fit your project's specifics or personal preferences!
