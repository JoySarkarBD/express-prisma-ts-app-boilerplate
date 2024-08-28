#!/usr/bin/env node

const [, , command, ...args] = process.argv;

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Define color codes for console output
const GREEN = '\x1b[32m'; // Green color
const BLUE = '\x1b[34m'; // Blue color
const RESET = '\x1b[0m'; // Reset color

// Regular expression to check for special characters
const specialCharRegex = /[0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/~`|\-=\s]/g;

// Helper function to capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to convert string to camelCase after replacing unwanted characters with hyphens
function toCamelCase(str) {
  // Replace all non-alphabetic characters (except hyphens) with hyphens
  const hyphenatedStr = str.replace(/[^a-zA-Z]+/g, '-').replace(/^-+|-+$/g, '');

  // Convert hyphenated string to camelCase
  return hyphenatedStr
    .split('-') // Split the string by hyphens
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(''); // Join all words together without hyphens
}

if (command === 'resource') {
  // Command-line options setup
  program
    .version('1.0.0') // Version of the CLI tool
    .description('Generate route, model, controller, and interface files for a new resource') // Description of the tool
    .argument('<name>', 'Resource name') // Argument for resource name
    .action((name) => {
      const resourceName = !specialCharRegex.test(args[0])
        ? args[0].toLowerCase()
        : toCamelCase(args[0]);

      const capitalizedResourceName = capitalize(resourceName);

      // Path to the route directory
      const routeDir = path.join(__dirname, '..', 'src', 'modules', args[0]);
      // Path to the controller directory
      const controllerDir = path.join(__dirname, '..', 'src', 'modules', args[0]);
      // Path to the model directory
      const validationDir = path.join(__dirname, '..', 'src', 'modules', args[0]);
      // Path to the service directory
      const serviceDir = path.join(__dirname, '..', 'src', 'modules', args[0]);

      // Function to format file paths relative to project root
      const formatPath = (filePath) => path.relative(path.join(__dirname, '..'), filePath);

      // Create the resource directories if they don't exist
      [routeDir, controllerDir].forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      // Create route file content
      const routeContent = `
// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  create${capitalizedResourceName},
  createMany${capitalizedResourceName},
  update${capitalizedResourceName},
  updateMany${capitalizedResourceName},
  delete${capitalizedResourceName},
  deleteMany${capitalizedResourceName},
  get${capitalizedResourceName}ById,
  getMany${capitalizedResourceName}
} from './${args[0]}.controller';

//Import validation from corresponding module
import { validate${capitalizedResourceName}Id } from './${args[0]}.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/${args[0]}/create-${args[0]}
 * @description Create a new ${args[0]}
 * @access Public
 * @param {function} controller - ['create${capitalizedResourceName}']
 */
router.post("/create-${args[0]}", create${capitalizedResourceName});

/**
 * @route POST /api/v1/${args[0]}/create-${args[0]}/many
 * @description Create multiple ${args[0]}
 * @access Public
 * @param {function} controller - ['createMany${capitalizedResourceName}']
 */
router.post("/create-${args[0]}/many", createMany${capitalizedResourceName});

/**
 * @route PUT /api/v1/${args[0]}/update-${args[0]}/many
 * @description Update multiple ${args[0]} information
 * @access Public
 * @param {function} controller - ['updateMany${capitalizedResourceName}']
 */
router.put("/update-${args[0]}/many", updateMany${capitalizedResourceName});

/**
 * @route PUT /api/v1/${args[0]}/update-${args[0]}/:id
 * @description Update ${args[0]} information
 * @param {string} id - The ID of the ${args[0]} to update
 * @access Public
 * @param {function} controller - ['update${capitalizedResourceName}']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.put("/update-${args[0]}/:id", validate${capitalizedResourceName}Id, update${capitalizedResourceName});


/**
 * @route DELETE /api/v1/${args[0]}/delete-${args[0]}/many
 * @description Delete multiple ${args[0]}
 * @access Public
 * @param {function} controller - ['deleteMany${capitalizedResourceName}']
 */
router.delete("/delete-${args[0]}/many", deleteMany${capitalizedResourceName});

/**
 * @route DELETE /api/v1/${args[0]}/delete-${args[0]}/:id
 * @description Delete a ${args[0]}
 * @param {string} id - The ID of the ${args[0]} to delete
 * @access Public
 * @param {function} controller - ['delete${capitalizedResourceName}']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.delete("/delete-${args[0]}/:id", validate${capitalizedResourceName}Id, delete${capitalizedResourceName});

/**
 * @route GET /api/v1/${args[0]}/get-${args[0]}/many
 * @description Get multiple ${args[0]}
 * @access Public
 * @param {function} controller - ['getMany${capitalizedResourceName}']
 */
router.get("/get-${args[0]}/many", getMany${capitalizedResourceName});

/**
 * @route GET /api/v1/${args[0]}/get-${args[0]}/:id
 * @description Get a ${args[0]} by ID
 * @param {string} id - The ID of the ${args[0]} to retrieve
 * @access Public
 * @param {function} controller - ['get${capitalizedResourceName}ById']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.get("/get-${args[0]}/:id", validate${capitalizedResourceName}Id, get${capitalizedResourceName}ById);

// Export the router
module.exports = router;
    `;

      // Path to the route file
      const routeFilePath = path.join(routeDir, `${args[0]}.route.ts`);
      // Write content to the route file
      fs.writeFileSync(routeFilePath, routeContent.trim());

      // Create controller file content
      const controllerContent = `
import { Request, Response } from 'express';
import { ${resourceName}Services } from './${args[0]}.service';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single ${capitalizedResourceName}.
 *
 * @param {Request} req - The request object containing ${args[0]} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const create${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new ${args[0]} and get the result
  const result = await ${resourceName}Services.create${capitalizedResourceName}(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, '${capitalizedResourceName} created successfully', result);
});

/**
 * Controller function to handle the creation of multiple ${args[0]}.
 *
 * @param {Request} req - The request object containing an array of ${args[0]} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple ${resourceName}s and get the result
  const result = await ${resourceName}Services.createMany${capitalizedResourceName}(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single ${args[0]}.
 *
 * @param {Request} req - The request object containing the ID of the ${args[0]} to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const update${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the ${args[0]} by ID and get the result
  const result = await ${resourceName}Services.update${capitalizedResourceName}(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, '${capitalizedResourceName} updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple ${args[0]}.
 *
 * @param {Request} req - The request object containing an array of ${args[0]} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple ${args[0]} and get the result
  const result = await ${resourceName}Services.updateMany${capitalizedResourceName}(req.body);
  // Send a success response with the updated resources data
  ServerResponse(res, true, 200, 'Resources updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single ${args[0]}.
 *
 * @param {Request} req - The request object containing the ID of the ${args[0]} to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const delete${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the ${args[0]} by ID
  await ${resourceName}Services.delete${capitalizedResourceName}(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, '${capitalizedResourceName} deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple ${args[0]}.
 *
 * @param {Request} req - The request object containing an array of IDs of ${args[0]} to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple ${args[0]} and get the result
  await ${resourceName}Services.deleteMany${capitalizedResourceName}(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single ${args[0]} by ID.
 *
 * @param {Request} req - The request object containing the ID of the ${args[0]} to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const get${capitalizedResourceName}ById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the ${args[0]} by ID and get the result
  const result = await ${resourceName}Services.get${capitalizedResourceName}ById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, '${capitalizedResourceName} retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple ${args[0]}.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple ${args[0]} based on query parameters and get the result
  const result = await ${resourceName}Services.getMany${capitalizedResourceName}(req.query);
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});
    `;

      // Path to the controller file
      const controllerFilePath = path.join(controllerDir, `${args[0]}.controller.ts`);
      // Write content to the controller file
      fs.writeFileSync(controllerFilePath, controllerContent.trim());

      // Create Zod validation schema content
      const validationContent = `
import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating ${resourceName} data.
 */
const zod${capitalizedResourceName}Schema = z.object({
  id: z
    .string({
      required_error: "Id is required",
      invalid_type_error: "Please provide a valid id",
    })
    .uuid({
      message: "Please provide a valid UUID",
    }),
  ids: z
    .array(z.string().uuid({
      message: "Each ID must be a valid UUID",
    }))
    .min(1, {
      message: "At least one ID must be provided",
    }),
}).strict();
    
/**
 * Middleware function to validate ${resourceName} ID using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validate${capitalizedResourceName}Id = (req: Request, res: Response, next: NextFunction) => {
  // Validate request params
  const { error, success } = zod${capitalizedResourceName}Schema.pick({ id: true }).safeParse({ id: req.params.id });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};
    `;

      // Path to the zod validation file
      const validationFilePath = path.join(validationDir, `${args[0]}.validation.ts`);
      // Write content to the validation file
      fs.writeFileSync(validationFilePath, validationContent.trim());

      // Create service content
      const serviceContent = `
import { Prisma } from '@prisma/client';

// Import the Prisma Client instance
import { prismaClient } from '../../index';

/**
 * Service function to create a new ${resourceName}.
 *
 * @param data - The data to create a new ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}>} - The created ${resourceName}.
 */
const create${capitalizedResourceName} = async (data: Prisma.${capitalizedResourceName}CreateInput) => {
  return await prismaClient.${resourceName}.create({ data });
};

/**
 * Service function to create multiple ${resourceName}.
 *
 * @param data - An array of data to create multiple ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}[]>} - The created ${resourceName}.
 */
const createMany${capitalizedResourceName} = async (data: Prisma.${capitalizedResourceName}CreateManyInput[]) => {
  return await prismaClient.${resourceName}.createMany({ data });
};

/**
 * Service function to update a single ${resourceName} by ID.
 *
 * @param id - The ID of the ${resourceName} to update.
 * @param data - The updated data for the ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}>} - The updated ${resourceName}.
 */
const update${capitalizedResourceName} = async (id: string, data: Prisma.${capitalizedResourceName}UpdateInput) => {
  return await prismaClient.${resourceName}.update({
    where: { id },
    data,
  });
};

/**
 * Service function to update multiple ${resourceName}.
 *
 * @param data - An array of data to update multiple ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}[]>} - The updated ${resourceName}.
 */
const updateMany${capitalizedResourceName} = async (data: { id: string; updates: Prisma.${capitalizedResourceName}UpdateInput}[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    prismaClient.${resourceName}.update({
      where: { id },
      data: updates,
    })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single ${resourceName} by ID.
 *
 * @param id - The ID of the ${resourceName} to delete.
 * @returns {Promise<${capitalizedResourceName}>} - The deleted ${resourceName}.
 */
const delete${capitalizedResourceName} = async (id: string) => {
  return await prismaClient.${resourceName}.delete({
    where: { id },
  });
};

/**
 * Service function to delete multiple ${resourceName}.
 *
 * @param ids - An array of IDs of ${resourceName} to delete.
 * @returns {Promise<${capitalizedResourceName}[]>} - The deleted ${resourceName}.
 */
const deleteMany${capitalizedResourceName} = async (ids: string[]) => {
  return await prismaClient.${resourceName}.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

/**
 * Service function to retrieve a single ${resourceName} by ID.
 *
 * @param id - The ID of the ${resourceName} to retrieve.
 * @returns {Promise<${capitalizedResourceName}>} - The retrieved ${resourceName}.
 */
const get${capitalizedResourceName}ById = async (id: string) => {
  return await prismaClient.${resourceName}.findUnique({
    where: { id },
  });
};

/**
 * Service function to retrieve multiple ${resourceName} based on query parameters.
 *
 * @param query - The query parameters for filtering ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}[]>} - The retrieved ${resourceName}.
 */
const getMany${capitalizedResourceName} = async (query: Prisma.${capitalizedResourceName}WhereInput) => {
  return await prismaClient.${resourceName}.findMany({
    where: query,
  });
};

export const ${resourceName}Services = {
  create${capitalizedResourceName},
  createMany${capitalizedResourceName},
  update${capitalizedResourceName},
  updateMany${capitalizedResourceName},
  delete${capitalizedResourceName},
  deleteMany${capitalizedResourceName},
  get${capitalizedResourceName}ById,
  getMany${capitalizedResourceName},
};
    `;

      // Path to the service file
      const serviceFilePath = path.join(serviceDir, `${args[0]}.service.ts`);
      // Write content to the service file
      fs.writeFileSync(serviceFilePath, serviceContent.trim());

      // Log the creation of the controller, interface, model , route, service & validation files
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(
          controllerFilePath
        )} ${BLUE}(${Buffer.byteLength(controllerContent, 'utf8')} bytes)`
      );
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(
          routeFilePath
        )} ${BLUE}(${Buffer.byteLength(routeContent, 'utf8')} bytes)`
      );
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(
          serviceFilePath
        )} ${BLUE}(${Buffer.byteLength(serviceContent, 'utf8')} bytes)`
      );
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(
          validationFilePath
        )} ${BLUE}(${Buffer.byteLength(validationContent, 'utf8')} bytes)`
      );
    });

  program.parse(process.argv);
} else if (command === 'nested-resource') {
  program
    .version('1.0.0')
    .description('Generate nested route, model, controller, and interface files for a new resource')
    .argument('<path>', 'Nested path to resource (e.g., folder1/folder2/resourceName)')
    .action((nestedPath) => {
      const parts = args[0].split('/');

      // Convert the last part of the path to camelCase if it contains '-' or '_'
      const resourceName = parts.pop();

      const resourceCamelCaseName = !specialCharRegex.test(args[0])
        ? resourceName.toLowerCase()
        : toCamelCase(resourceName);

      const nestedFolders = parts;

      const capitalizedResourceName = capitalize(resourceCamelCaseName);

      const baseDir = path.join(__dirname, '..', 'src');

      const moduleDir = path.join(baseDir, 'modules', ...nestedFolders, resourceName);

      // Function to format file paths relative to project root
      const formatPath = (filePath) => path.relative(path.join(__dirname, '..'), filePath);

      // Create the nested directories
      if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
      }

      // Create route file content (similar to the original, adjusted for nested structure)
      const routeContent = `
// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  create${capitalizedResourceName},
  createMany${capitalizedResourceName},
  update${capitalizedResourceName},
  updateMany${capitalizedResourceName},
  delete${capitalizedResourceName},
  deleteMany${capitalizedResourceName},
  get${capitalizedResourceName}ById,
  getMany${capitalizedResourceName}
} from './${resourceName}.controller';

//Import validation from corresponding module
import { validate${capitalizedResourceName}Id } from './${resourceName}.validation';
      
// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/${nestedFolders.join('/')}/${resourceName}/create-${resourceName}
 * @description Create a new ${resourceName}
 * @access Public
 * @param {function} controller - ['create${capitalizedResourceName}']
 */
router.post("/create-${resourceName}", create${capitalizedResourceName});

/**
 * @route POST /api/v1/${nestedFolders.join('/')}/${resourceName}/create-${resourceName}/many
 * @description Create multiple ${resourceName}
 * @access Public
 * @param {function} controller - ['createMany${capitalizedResourceName}']
 */
router.post("/create-${resourceName}/many", createMany${capitalizedResourceName});

/**
 * @route PUT /api/v1/${nestedFolders.join('/')}/${resourceName}/update-${resourceName}/many
 * @description Update multiple ${resourceName} information
 * @access Public
 * @param {function} controller - ['updateMany${capitalizedResourceName}']
 */
router.put("/update-${resourceName}/many", updateMany${capitalizedResourceName});

/**
 * @route PUT /api/v1/${nestedFolders.join('/')}/${resourceName}/update-${resourceName}/:id
 * @description Update ${resourceName} information
 * @param {string} id - The ID of the ${resourceName} to update
 * @access Public
 * @param {function} controller - ['update${capitalizedResourceName}']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.put("/update-${resourceName}/:id", validate${capitalizedResourceName}Id, update${capitalizedResourceName});


/**
 * @route DELETE /api/v1/${nestedFolders.join('/')}/${resourceName}/delete-${resourceName}/many
 * @description Delete multiple ${resourceName}
 * @access Public
 * @param {function} controller - ['deleteMany${capitalizedResourceName}']
 */
router.delete("/delete-${resourceName}/many", deleteMany${capitalizedResourceName});

/**
 * @route DELETE /api/v1/${nestedFolders.join('/')}/${resourceName}/delete-${resourceName}/:id
 * @description Delete a ${resourceName}
 * @param {string} id - The ID of the ${resourceName} to delete
 * @access Public
 * @param {function} controller - ['delete${capitalizedResourceName}']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.delete("/delete-${resourceName}/:id", validate${capitalizedResourceName}Id, delete${capitalizedResourceName});

/**
 * @route GET /api/v1/${nestedFolders.join('/')}/${resourceName}/get-${resourceName}/many
 * @description Get multiple ${resourceName}
 * @access Public
 * @param {function} controller - ['getMany${capitalizedResourceName}']
 */
router.get("/get-${resourceName}/many", getMany${capitalizedResourceName});

/**
 * @route GET /api/v1/${nestedFolders.join('/')}/${resourceName}/get-${resourceName}/:id
 * @description Get a ${resourceName} by ID
 * @param {string} id - The ID of the ${resourceName} to retrieve
 * @access Public
 * @param {function} controller - ['get${capitalizedResourceName}ById']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.get("/get-${resourceName}/:id", validate${capitalizedResourceName}Id, get${capitalizedResourceName}ById);

// Export the router
module.exports = router;
    `;

      // Path to the route file
      const routeFilePath = path.join(moduleDir, `${resourceName}.route.ts`);
      fs.writeFileSync(routeFilePath, routeContent.trim());

      // Create controller file content (similar to the original)
      const controllerContent = `
import { Request, Response } from 'express';
import { ${resourceCamelCaseName}Services } from './${resourceName}.service';
import ServerResponse from '${Array(nestedFolders.length + 2)
        .fill('..')
        .join('/')}/helpers/responses/custom-response';
import catchAsync from '${Array(nestedFolders.length + 2)
        .fill('..')
        .join('/')}/utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single ${capitalizedResourceName}.
 *
 * @param {Request} req - The request object containing ${resourceName} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const create${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new ${resourceName} and get the result
  const result = await ${resourceCamelCaseName}Services.create${capitalizedResourceName}(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, '${capitalizedResourceName} created successfully', result);
});

/**
 * Controller function to handle the creation of multiple ${resourceName}.
 *
 * @param {Request} req - The request object containing an array of ${resourceName} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple ${resourceName} and get the result
  const result = await ${resourceCamelCaseName}Services.createMany${capitalizedResourceName}(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single ${capitalizedResourceName}.
 *
 * @param {Request} req - The request object containing the ID of the ${resourceName} to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const update${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the ${resourceName} by ID and get the result
  const result = await ${resourceCamelCaseName}Services.update${capitalizedResourceName}(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, '${capitalizedResourceName} updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple ${resourceName}.
 *
 * @param {Request} req - The request object containing an array of ${resourceName} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple ${resourceName} and get the result
  const result = await ${resourceCamelCaseName}Services.updateMany${capitalizedResourceName}(req.body);
  // Send a success response with the updated resources data
  ServerResponse(res, true, 200, 'Resources updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single ${capitalizedResourceName}.
 *
 * @param {Request} req - The request object containing the ID of the ${resourceName} to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const delete${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the ${resourceName} by ID
  await ${resourceCamelCaseName}Services.delete${capitalizedResourceName}(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, '${capitalizedResourceName} deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple ${resourceName}.
 *
 * @param {Request} req - The request object containing an array of IDs of ${resourceName} to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple ${resourceName} and get the result
  await ${resourceCamelCaseName}Services.deleteMany${capitalizedResourceName}(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single ${capitalizedResourceName} by ID.
 *
 * @param {Request} req - The request object containing the ID of the ${resourceName} to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const get${capitalizedResourceName}ById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the ${resourceName} by ID and get the result
  const result = await ${resourceCamelCaseName}Services.get${capitalizedResourceName}ById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, '${capitalizedResourceName} retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple ${resourceName}.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple ${resourceName} based on query parameters and get the result
  const result = await ${resourceCamelCaseName}Services.getMany${capitalizedResourceName}(req.query);
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});
    `;

      // Path to the controller file
      const controllerFilePath = path.join(moduleDir, `${resourceName}.controller.ts`);
      fs.writeFileSync(controllerFilePath, controllerContent.trim());

      // Create Zod validation schema file (similar to the original)
      const validationContent = `
import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from '${Array(nestedFolders.length + 2)
        .fill('..')
        .join('/')}/handlers/zod-error-handler';

/**
 * Zod schema for validating ${resourceName} data.
 */
const zod${capitalizedResourceName}Schema = z.object({
  id: z
    .string({
      required_error: "Id is required",
      invalid_type_error: "Please provide a valid id",
    })
    .uuid({
      message: "Please provide a valid UUID",
    }),
  ids: z
    .array(z.string().uuid({
      message: "Each ID must be a valid UUID",
    }))
    .min(1, {
      message: "At least one ID must be provided",
    }),
}).strict();

/**
 * Middleware function to validate ${resourceName} ID using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validate${capitalizedResourceName}Id = (req: Request, res: Response, next: NextFunction) => {
  // Validate request params
  const { error, success } = zod${capitalizedResourceName}Schema.pick({ id: true }).safeParse({ id: req.params.id });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};
    `;

      // Path to the zod validation file
      const validationFilePath = path.join(moduleDir, `${resourceName}.validation.ts`);
      fs.writeFileSync(validationFilePath, validationContent.trim());

      // Create service content
      const serviceContent = `
import { Prisma } from '@prisma/client';

// Import the prisma client
import { prismaClient } from '${Array(nestedFolders.length + 2)
        .fill('..')
        .join('/')}/index';

/**
 * Service function to create a new ${resourceName}.
 *
 * @param data - The data to create a new ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}>} - The created ${resourceName}.
 */
const create${capitalizedResourceName} = async (data: Prisma.${capitalizedResourceName}CreateInput) => {
  return await prismaClient.${resourceName}.create({ data });
};

/**
 * Service function to create multiple ${resourceName}.
 *
 * @param data - An array of data to create multiple ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}[]>} - The created ${resourceName}.
 */
const createMany${capitalizedResourceName} = async (data: Prisma.${capitalizedResourceName}CreateManyInput[]) => {
  return await prismaClient.${resourceName}.createMany({ data });
};

/**
 * Service function to update a single ${resourceName} by ID.
 *
 * @param id - The ID of the ${resourceName} to update.
 * @param data - The updated data for the ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}>} - The updated ${resourceName}.
 */
const update${capitalizedResourceName} = async (id: string, data: Prisma.${capitalizedResourceName}UpdateInput) => {
  return await prismaClient.${resourceName}.update({
    where: { id },
    data,
  });
};

/**
 * Service function to update multiple ${resourceName}.
 *
 * @param data - An array of data to update multiple ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}[]>} - The updated ${resourceName}.
 */
const updateMany${capitalizedResourceName} = async (data: { id: string; updates: Prisma.${capitalizedResourceName}UpdateInput}[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    prismaClient.${resourceName}.update({
      where: { id },
      data: updates,
    })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single ${resourceName} by ID.
 *
 * @param id - The ID of the ${resourceName} to delete.
 * @returns {Promise<${capitalizedResourceName}>} - The deleted ${resourceName}.
 */
const delete${capitalizedResourceName} = async (id: string) => {
  return await prismaClient.${resourceName}.delete({
    where: { id },
  });
};

/**
 * Service function to delete multiple ${resourceName}.
 *
 * @param ids - An array of IDs of ${resourceName} to delete.
 * @returns {Promise<${capitalizedResourceName}[]>} - The deleted ${resourceName}.
 */
const deleteMany${capitalizedResourceName} = async (ids: string[]) => {
  return await prismaClient.${resourceName}.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

/**
 * Service function to retrieve a single ${resourceName} by ID.
 *
 * @param id - The ID of the ${resourceName} to retrieve.
 * @returns {Promise<${capitalizedResourceName}>} - The retrieved ${resourceName}.
 */
const get${capitalizedResourceName}ById = async (id: string) => {
  return await prismaClient.${resourceName}.findUnique({
    where: { id },
  });
};

/**
 * Service function to retrieve multiple ${resourceName} based on query parameters.
 *
 * @param query - The query parameters for filtering ${resourceName}.
 * @returns {Promise<${capitalizedResourceName}[]>} - The retrieved ${resourceName}.
 */
const getMany${capitalizedResourceName} = async (query: Prisma.${capitalizedResourceName}WhereInput) => {
  return await prismaClient.${resourceName}.findMany({
    where: query,
  });
};

export const ${resourceName}Services = {
  create${capitalizedResourceName},
  createMany${capitalizedResourceName},
  update${capitalizedResourceName},
  updateMany${capitalizedResourceName},
  delete${capitalizedResourceName},
  deleteMany${capitalizedResourceName},
  get${capitalizedResourceName}ById,
  getMany${capitalizedResourceName},
};
    `;

      // Path to the service file
      const serviceFilePath = path.join(moduleDir, `${resourceName}.service.ts`);
      // Write content to the service file
      fs.writeFileSync(serviceFilePath, serviceContent.trim());

      // Log the creation of the controller, interface, model , route, service & validation files
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(controllerFilePath)} ${BLUE}(${Buffer.byteLength(controllerContent, 'utf8')} bytes)`
      );
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(routeFilePath)} ${BLUE}(${Buffer.byteLength(routeContent, 'utf8')} bytes)`
      );
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(
          serviceFilePath
        )} ${BLUE}(${Buffer.byteLength(serviceContent, 'utf8')} bytes)`
      );
      console.log(
        `${GREEN}CREATE ${RESET}${formatPath(validationFilePath)} ${BLUE}(${Buffer.byteLength(validationContent, 'utf8')} bytes)`
      );
    });

  program.parse(process.argv);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
