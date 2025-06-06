#!/usr/bin/env node

const [, , command, ...args] = process.argv;

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const readline = require('readline');

// Define color codes for console output
const RED = '\x1b[31m'; // Red color
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
import { validateCreate${capitalizedResourceName}, validateCreateMany${capitalizedResourceName}, validateUpdate${capitalizedResourceName}, validateUpdateMany${capitalizedResourceName}} from './${args[0]}.validation';
import { validateId, validateIds, validateSearchQueries } from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/${args[0]}/create-${args[0]}
 * @description Create a new ${args[0]}
 * @access Public
 * @param {function} controller - ['create${capitalizedResourceName}']
 * @param {function} validation - ['validateCreate${capitalizedResourceName}']
 */
router.post("/create-${args[0]}", validateCreate${capitalizedResourceName}, create${capitalizedResourceName});

/**
 * @route POST /api/v1/${args[0]}/create-${args[0]}/many
 * @description Create multiple ${args[0]}s
 * @access Public
 * @param {function} controller - ['createMany${capitalizedResourceName}']
 * @param {function} validation - ['validateCreateMany${capitalizedResourceName}']
 */
router.post("/create-${args[0]}/many", validateCreateMany${capitalizedResourceName}, createMany${capitalizedResourceName});

/**
 * @route PATCH /api/v1/${args[0]}/update-${args[0]}/many
 * @description Update multiple ${args[0]}s information
 * @access Public
 * @param {function} controller - ['updateMany${capitalizedResourceName}']
 * @param {function} validation - ['validateIds', 'validateUpdateMany${capitalizedResourceName}']
 */
router.patch("/update-${args[0]}/many", validateIds, validateUpdateMany${capitalizedResourceName}, updateMany${capitalizedResourceName});

/**
 * @route PATCH /api/v1/${args[0]}/update-${args[0]}/:id
 * @description Update ${args[0]} information
 * @param {string} id - The ID of the ${args[0]} to update
 * @access Public
 * @param {function} controller - ['update${capitalizedResourceName}']
 * @param {function} validation - ['validateId', 'validateUpdate${capitalizedResourceName}']
 */
router.patch("/update-${args[0]}/:id", validateId, validateUpdate${capitalizedResourceName}, update${capitalizedResourceName});

/**
 * @route DELETE /api/v1/${args[0]}/delete-${args[0]}/many
 * @description Delete multiple ${args[0]}s
 * @access Public
 * @param {function} controller - ['deleteMany${capitalizedResourceName}']
 * @param {function} validation - ['validateIds']
 */
router.delete("/delete-${args[0]}/many", validateIds, deleteMany${capitalizedResourceName});

/**
 * @route DELETE /api/v1/${args[0]}/delete-${args[0]}/:id
 * @description Delete a ${args[0]}
 * @param {string} id - The ID of the ${args[0]} to delete
 * @access Public
 * @param {function} controller - ['delete${capitalizedResourceName}']
 * @param {function} validation - ['validateId']
 */
router.delete("/delete-${args[0]}/:id", validateId, delete${capitalizedResourceName});

/**
 * @route GETapi/v1/${args[0]}/get-${args[0]}/many
 * @description Get multiple ${args[0]}s
 * @access Public
 * @param {function} controller - ['getMany${capitalizedResourceName}']
 * @param {function} validation - ['validateSearchQueries']
 */
router.get("/get-${args[0]}/many", validateSearchQueries, getMany${capitalizedResourceName});

/**
 * @route GET /api/v1/${args[0]}/get-${args[0]}/:id
 * @description Get a ${args[0]} by ID
 * @param {string} id - The ID of the ${args[0]} to retrieve
 * @access Public
 * @param {function} controller - ['get${capitalizedResourceName}ById']
 * @param {function} validation - ['validateId']
 */
router.get("/get-${args[0]}/:id", validateId, get${capitalizedResourceName}ById);

// Export the router
module.exports = router;
    `;
      // Path to the route file
      const routeFilePath = path.join(routeDir, `${args[0]}.route.ts`);

      // Path to the controller directory
      const controllerDir = path.join(__dirname, '..', 'src', 'modules', args[0]);
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
  // Send a success response with the created ${args[0]} data
  ServerResponse(res, true, 201, '${capitalizedResourceName} created successfully', result);
});

/**
 * Controller function to handle the creation of multiple ${args[0]}s.
 *
 * @param {Request} req - The request object containing an array of ${args[0]} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple ${resourceName}s and get the result
  const result = await ${resourceName}Services.createMany${capitalizedResourceName}(req.body);
  // Send a success response with the created ${args[0]}s data
  ServerResponse(res, true, 201, '${capitalizedResourceName}s created successfully', result);
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
  // Send a success response with the updated ${args[0]} data
  ServerResponse(res, true, 200, '${capitalizedResourceName} updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple ${args[0]}s.
 *
 * @param {Request} req - The request object containing an array of ${args[0]} data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple ${args[0]}s and get the result
  const result = await ${resourceName}Services.updateMany${capitalizedResourceName}(req.body);
  // Send a success response with the updated ${args[0]}s data
  ServerResponse(res, true, 200, '${capitalizedResourceName}s updated successfully', result);
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
 * Controller function to handle the deletion of multiple ${args[0]}s.
 *
 * @param {Request} req - The request object containing an array of IDs of ${args[0]} to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple ${args[0]}s and get the result
  await ${resourceName}Services.deleteMany${capitalizedResourceName}(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, '${capitalizedResourceName}s deleted successfully');
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
  // Send a success response with the retrieved ${args[0]} data
  ServerResponse(res, true, 200, '${capitalizedResourceName} retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple ${args[0]}s.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getMany${capitalizedResourceName} = catchAsync(async (req: Request, res: Response) => {
  // Type assertion for query parameters
  const query = req.query as unknown as { searchKey?: string; showPerPage: number; pageNo: number };
  // Call the service method to get multiple ${args[0]}s based on query parameters and get the result
  const {${args[0]}s, totalData, totalPages } = await ${resourceName}Services.getMany${capitalizedResourceName}({},query.searchKey, query.showPerPage, query.pageNo);
  // Send a success response with the retrieved ${args[0]}s data
  ServerResponse(res, true, 200, '${capitalizedResourceName}s retrieved successfully', {${args[0]}s, totalData, totalPages});
});
    `;
      // Path to the controller file
      const controllerFilePath = path.join(controllerDir, `${args[0]}.controller.ts`);

      // Path to the model directory
      const validationDir = path.join(__dirname, '..', 'src', 'modules', args[0]);
      // Create Zod validation schema content
      const validationContent = `
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating ${resourceName} data during creation.
 */
const zodCreate${capitalizedResourceName}Schema = z.object({
  // Define fields required for creating a new ${resourceName}.
  // Example:
  // filedName: z.string({ required_error: 'Please provide a filedName.' }).min(1, "Can't be empty."),
}).strict();

/**
 * Middleware function to validate ${resourceName} creation data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateCreate${capitalizedResourceName} = (req: Request, res: Response, next: NextFunction) => {
  // Validate the request body for creating a new ${resourceName}
  const parseResult = zodCreate${capitalizedResourceName}Schema.safeParse(req.body);

  // If validation fails, send an error response using the Zod error handler
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }

  // If validation passes, proceed to the next middleware function
  return next();
};

/**
 * Zod schema for validating multiple ${resourceName} data during creation.
 */
const zodCreateMany${capitalizedResourceName}Schema = z.array(zodCreate${capitalizedResourceName}Schema);

/**
 * Middleware function to validate multiple ${resourceName} creation data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateCreateMany${capitalizedResourceName} = (req: Request, res: Response, next: NextFunction) => {
  const parseResult = zodCreateMany${capitalizedResourceName}Schema.safeParse(req.body);
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }
  return next();
};

/**
 * Zod schema for validating ${resourceName} data during updates.
 */
const zodUpdate${capitalizedResourceName}Schema = z.object({
  // Define fields required for updating an existing ${resourceName}.
  // Example:
  // fieldName: z.string({ required_error: 'Please provide a filedName.' }).optional(), // Fields can be optional during updates
}).strict();

/**
 * Middleware function to validate ${resourceName} update data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateUpdate${capitalizedResourceName} = (req: Request, res: Response, next: NextFunction) => {
  // Validate the request body for updating an existing ${resourceName}
  const parseResult = zodUpdate${capitalizedResourceName}Schema.safeParse(req.body);

  // If validation fails, send an error response using the Zod error handler
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }

  // If validation passes, proceed to the next middleware function
  return next();
};

/**
 * Zod schema for validating multiple ${resourceName} data during updates.
 */
const zodUpdateMany${capitalizedResourceName}Schema = z.array(zodUpdate${capitalizedResourceName}Schema);


/**
 * Middleware function to validate multiple ${resourceName} update data using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateUpdateMany${capitalizedResourceName} = (req: Request, res: Response, next: NextFunction) => {
  const parseResult = zodUpdateMany${capitalizedResourceName}Schema.safeParse(req.body);
  if (!parseResult.success) {
    return zodErrorHandler(req, res, parseResult.error);
  }
  return next();
};
    `;
      // Path to the zod validation file
      const validationFilePath = path.join(validationDir, `${args[0]}.validation.ts`);

      // Path to the service directory
      const serviceDir = path.join(__dirname, '..', 'src', 'modules', args[0]);
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
 * Service function to retrieve multiple ${resourceName}s based on query parameters.
 *
 * @param query - The query parameters for filtering ${resourceName}s.
 * @param {string | undefined} searchKey - The optional search key for filtering ${resourceName}s by ${resourceName} fields.
 * @param {number} showPerPage - The number of items to show per page.
 * @param {number} pageNo - The page number for pagination.
 * @returns {Promise<{ ${capitalizedResourceName}s: Prisma.${capitalizedResourceName}[], total: number, totalPages: number }>} - The retrieved ${resourceName}s, total count, and total pages.
 */
const getMany${capitalizedResourceName} = async (
  query: Prisma.${capitalizedResourceName}WhereInput,
  searchKey: string | undefined,
  showPerPage: number,
  pageNo: number
): Promise<{ ${resourceName}s: Prisma.${capitalizedResourceName}[]; totalData: number; totalPages: number }> => {
  // Build the search filter based on the search key, if provided
  const searchFilter: Prisma.${capitalizedResourceName}WhereInput = {
    ...query,
    OR: searchKey
      ? [
          { filedName: { contains: searchKey, mode: 'insensitive' } },
          // Add more fields as needed
        ]
      : undefined,
  };

  // Calculate the number of items to skip based on the page number
  const skipItems = (pageNo - 1) * showPerPage;

  // Find the total count of matching ${resourceName}s
  const totalData = await prismaClient.${resourceName}.count({
    where: searchFilter,
  });

  // Find ${resourceName}s based on the search filter with pagination
  const ${resourceName}s = await prismaClient.${resourceName}.findMany({
    where: searchFilter,
    skip: skipItems,
    take: showPerPage,
    select: {
      // filed: true,
      // filed: false,
      // Add other fields as needed, excluding sensitive ones
    },
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);

  return { ${resourceName}s, totalData, totalPages };
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

      // Function to format file paths relative to project root
      const formatPath = (filePath) => path.relative(path.join(__dirname, '..'), filePath);

      // Create the resource directories if they don't exist
      [routeDir, controllerDir].forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      // Function to generate expected files based on the module name
      function getExpectedFiles(moduleName) {
        return [
          `${moduleName}.controller.ts`,
          `${moduleName}.route.ts`,
          `${moduleName}.service.ts`,
          `${moduleName}.validation.ts`,
        ];
      }

      // Function to ask questions in the command line
      function askQuestion(rl, question) {
        return new Promise((resolve) => {
          rl.question(question, resolve);
        });
      }

      // Function to search the search files and create theme
      async function searchFile(dir, moduleName) {
        const files = fs.readdirSync(dir);
        const capitalizedResourceName = capitalize(moduleName);

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        try {
          for (const module of files) {
            const modulePath = path.join(dir, module);

            if (module === moduleName) {
              const stat = fs.statSync(modulePath);

              if (stat.isDirectory()) {
                const foundFiles = fs.readdirSync(modulePath);
                const expectedFiles = getExpectedFiles(moduleName);
                const missingFiles = expectedFiles.filter((file) => !foundFiles.includes(file));

                if (missingFiles.length === 0) {
                  console.log(`${RED}${capitalizedResourceName} module already exists.${RESET}`);
                } else if (missingFiles.length > 0 && missingFiles.length < expectedFiles.length) {
                  console.log(
                    `${GREEN}${capitalizedResourceName} ${RESET}module exists, but some files are missing:`
                  );
                  missingFiles.forEach((file, index) =>
                    console.log(`${GREEN}${index + 1}. ${file}${RESET}`)
                  );

                  const answer = await askQuestion(
                    rl,
                    `${BLUE}Do you want to create missing files one by one (Yes/Y) or all at once (Create/C)?${RESET} Enter (Yes/Y) or (Create/C): `
                  );

                  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                    for (const file of missingFiles) {
                      const createFile = await askQuestion(
                        rl,
                        `${BLUE}Do you want to create ${GREEN}${file}?${RESET} (yes/no) `
                      );
                      if (createFile.toLowerCase() === 'yes' || createFile.toLowerCase() === 'y') {
                        await createSingleFile(modulePath, file, moduleName);
                      }
                    }
                  } else if (answer.toLowerCase() === 'create' || answer.toLowerCase() === 'c') {
                    await createAllFiles(modulePath, missingFiles, moduleName);
                  } else {
                    console.log(`${RED}Invalid option. No files will be created.${RESET}`);
                  }
                } else {
                  await createAllFiles(modulePath, missingFiles, moduleName);
                }

                return true;
              }
            }
          }
          return false;
        } finally {
          rl.close();
        }
      }

      // Function to create single resource file
      async function createSingleFile(modulePath, file, moduleName) {
        const filePath = path.join(modulePath, file);
        let content;

        switch (file) {
          case `${moduleName}.route.ts`:
            content = routeContent;
            break;
          case `${moduleName}.controller.ts`:
            content = controllerContent;
            break;
          case `${moduleName}.validation.ts`:
            content = validationContent;
            break;
          case `${moduleName}.service.ts`:
            content = serviceContent;
            break;
        }

        fs.writeFileSync(filePath, content.trim());
        console.log(
          `${GREEN}CREATE ${RESET}${formatPath(filePath)} ${BLUE}(${Buffer.byteLength(content, 'utf8')} bytes)${RESET}`
        );
      }

      // Function to create all resources files
      async function createAllFiles(modulePath, missingFiles, moduleName) {
        for (const file of missingFiles) {
          await createSingleFile(modulePath, file, moduleName);
        }
      }

      // Entry point
      (async () => {
        const moduleName = args[0];
        const srcPath = path.join(process.cwd(), 'src', 'modules');

        if (!moduleName) {
          console.log(`${RED}Please provide a module name.${RESET}`);
          return;
        }

        const found = await searchFile(srcPath, moduleName);
        if (!found) {
          console.log(`${RED}Module ${moduleName} not found.${RESET}`);
        }
      })();
    });

  program.parse(process.argv);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
