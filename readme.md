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

Open the `prisma/schema.prisma` file and define your data models. For example, to define a `User` model, you might use the following configuration:

```prisma
model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
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

To generate files for a resource named `user`, run:

```bash
npm run resource user
```

This will create the following files:

- **Controller File**: `src/modules/user/user.controller.ts`
- **Route File**: `src/modules/user/user.route.ts`
- **Service File**: `src/modules/user/user.service.ts`
- **Validation File**: `src/modules/user/user.validation.ts`

## File Structure

### Controller File (`user.controller.ts`)

Contains controller functions for handling HTTP requests, including:

- `createUser`
- `createManyUsers`
- `updateUser`
- `updateManyUsers`
- `deleteUser`
- `deleteManyUsers`
- `getUserById`
- `getManyUsers`

### Route File (`user.route.ts`)

Defines RESTful routes for the resource, including endpoints for creating, updating, deleting, and retrieving resources.

### Service File (`user.service.ts`)

The `user.service.ts` file contains service functions for managing user resources in the application. These functions interact with the `UserModel` to perform CRUD (Create, Read, Update, Delete) operations on user data.

### Validation File (`user.validation.ts`)

Includes Zod validation schemas and middleware functions for validating requests. The validation file ensures that IDs and other required fields are valid.

## Example Files

### Controller File Example

```typescript
import { Request, Response } from 'express';
import { userServices } from './user.service';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single User.
 *
 * @param {Request} req - The request object containing user data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new user and get the result
  const result = await userServices.createUser(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'User created successfully', result);
});

/**
 * Controller function to handle the creation of multiple user.
 *
 * @param {Request} req - The request object containing an array of user data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createManyUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple user and get the result
  const result = await userServices.createManyUser(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single User.
 *
 * @param {Request} req - The request object containing the ID of the user to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the user by ID and get the result
  const result = await userServices.updateUser(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'User updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple user.
 *
 * @param {Request} req - The request object containing an array of user data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateManyUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple user and get the result
  const result = await userServices.updateManyUser(req.body);
  // Send a success response with the updated resources data
  ServerResponse(res, true, 200, 'Resources updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single User.
 *
 * @param {Request} req - The request object containing the ID of the user to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the user by ID
  await userServices.deleteUser(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'User deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple user.
 *
 * @param {Request} req - The request object containing an array of IDs of user to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple user and get the result
  await userServices.deleteManyUser(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single User by ID.
 *
 * @param {Request} req - The request object containing the ID of the user to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the user by ID and get the result
  const result = await userServices.getUserById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'User retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple user.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getManyUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple user based on query parameters and get the result
  const result = await userServices.getManyUser(req.query);
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
  createUser,
  createManyUser,
  updateUser,
  updateManyUser,
  deleteUser,
  deleteManyUser,
  getUserById,
  getManyUser,
} from './user.controller';

//Import validation from corresponding module
import { validateUserId } from './user.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1//user/create-user
 * @description Create a new user
 * @access Public
 * @param {function} controller - ['createUser']
 */
router.post('/create-user', createUser);

/**
 * @route POST /api/v1//user/create-user/many
 * @description Create multiple user
 * @access Public
 * @param {function} controller - ['createManyUser']
 */
router.post('/create-user/many', createManyUser);

/**
 * @route PUT /api/v1//user/update-user/many
 * @description Update multiple user information
 * @access Public
 * @param {function} controller - ['updateManyUser']
 */
router.put('/update-user/many', updateManyUser);

/**
 * @route PUT /api/v1//user/update-user/:id
 * @description Update user information
 * @param {string} id - The ID of the user to update
 * @access Public
 * @param {function} controller - ['updateUser']
 * @param {function} validation - ['validateUserId']
 */
router.put('/update-user/:id', validateUserId, updateUser);

/**
 * @route DELETE /api/v1//user/delete-user/many
 * @description Delete multiple user
 * @access Public
 * @param {function} controller - ['deleteManyUser']
 */
router.delete('/delete-user/many', deleteManyUser);

/**
 * @route DELETE /api/v1//user/delete-user/:id
 * @description Delete a user
 * @param {string} id - The ID of the user to delete
 * @access Public
 * @param {function} controller - ['deleteUser']
 * @param {function} validation - ['validateUserId']
 */
router.delete('/delete-user/:id', validateUserId, deleteUser);

/**
 * @route GET /api/v1//user/get-user/many
 * @description Get multiple user
 * @access Public
 * @param {function} controller - ['getManyUser']
 */
router.get('/get-user/many', getManyUser);

/**
 * @route GET /api/v1//user/get-user/:id
 * @description Get a user by ID
 * @param {string} id - The ID of the user to retrieve
 * @access Public
 * @param {function} controller - ['getUserById']
 * @param {function} validation - ['validateUserId']
 */
router.get('/get-user/:id', validateUserId, getUserById);

// Export the router
module.exports = router;
```

### Service File Example

```typescript
import { Prisma } from '@prisma/client';

// Import the prisma client
import { prismaClient } from '../../index';

/**
 * Service function to create a new user.
 *
 * @param data - The data to create a new user.
 * @returns {Promise<User>} - The created user.
 */
const createUser = async (data: Prisma.UserCreateInput) => {
  return await prismaClient.user.create({ data });
};

/**
 * Service function to create multiple user.
 *
 * @param data - An array of data to create multiple user.
 * @returns {Promise<User[]>} - The created user.
 */
const createManyUser = async (data: Prisma.UserCreateManyInput[]) => {
  return await prismaClient.user.createMany({ data });
};

/**
 * Service function to update a single user by ID.
 *
 * @param id - The ID of the user to update.
 * @param data - The updated data for the user.
 * @returns {Promise<User>} - The updated user.
 */
const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return await prismaClient.user.update({
    where: { id },
    data,
  });
};

/**
 * Service function to update multiple user.
 *
 * @param data - An array of data to update multiple user.
 * @returns {Promise<User[]>} - The updated user.
 */
const updateManyUser = async (data: { id: string; updates: Prisma.UserUpdateInput }[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    prismaClient.user.update({
      where: { id },
      data: updates,
    })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single user by ID.
 *
 * @param id - The ID of the user to delete.
 * @returns {Promise<User>} - The deleted user.
 */
const deleteUser = async (id: string) => {
  return await prismaClient.user.delete({
    where: { id },
  });
};

/**
 * Service function to delete multiple user.
 *
 * @param ids - An array of IDs of user to delete.
 * @returns {Promise<User[]>} - The deleted user.
 */
const deleteManyUser = async (ids: string[]) => {
  return await prismaClient.user.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

/**
 * Service function to retrieve a single user by ID.
 *
 * @param id - The ID of the user to retrieve.
 * @returns {Promise<User>} - The retrieved user.
 */
const getUserById = async (id: string) => {
  return await prismaClient.user.findUnique({
    where: { id },
  });
};

/**
 * Service function to retrieve multiple user based on query parameters.
 *
 * @param query - The query parameters for filtering user.
 * @returns {Promise<User[]>} - The retrieved user.
 */
const getManyUser = async (query: Prisma.UserWhereInput) => {
  return await prismaClient.user.findMany({
    where: query,
  });
};

export const userServices = {
  createUser,
  createManyUser,
  updateUser,
  updateManyUser,
  deleteUser,
  deleteManyUser,
  getUserById,
  getManyUser,
};
```

### Validation File Example

```typescript
import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating user data.
 */
const zodUserSchema = z
  .object({
    id: z
      .string({
        required_error: 'Id is required',
        invalid_type_error: 'Please provide a valid id',
      })
      .refine((id: string) => isMongoId(id), {
        message: 'Please provide a valid id',
      }),
    ids: z
      .array(
        z.string().refine((id: string) => isMongoId(id), {
          message: 'Each ID must be a valid MongoDB ObjectId',
        })
      )
      .min(1, {
        message: 'At least one ID must be provided',
      }),
  })
  .strict();

/**
 * Middleware function to validate user ID using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  // Validate request params
  const { error, success } = zodUserSchema.pick({ id: true }).safeParse({ id: req.params.id });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};
```

---

### Nested CLI Commands

The CLI tool can be executed using the following command(nested resource):

**By using npm**:

```bash
npm run nested-resource folder1/folder2/<resource-name>
```

**By using yarn**:

```bash
yarn run nested-resource folder1/folder2/<resource-name>
```

**By using pnpm**:

```bash
pnpm run nested-resource folder1/folder2/<resource-name>
```

**It will act same like the previous command but it will generate the resources as nested you want.**

## Contact

For any questions or feedback, please contact [JoySarkar] at [developer.joysarkar@gmail.com].

---

Feel free to adjust any sections to better fit your project's specifics or personal preferences!
