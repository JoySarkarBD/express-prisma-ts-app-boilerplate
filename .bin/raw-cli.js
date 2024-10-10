#!/usr/bin/env node

const [, , command, ...args] = process.argv;

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const readline = require('readline');

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
import { validate${capitalizedResourceName} } from './${args[0]}.validation';
import { validateId, validateIds } from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/${args[0]}/create-${args[0]}
 * @description Create a new ${args[0]}
 * @access Public
 * @param {function} controller - ['create${capitalizedResourceName}']
 * @param {function} validation - ['validate${capitalizedResourceName}']
 */
router.post("/create-${args[0]}", validate${capitalizedResourceName}, create${capitalizedResourceName});

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
 * @param {function} validation - ['validateIds']
 */
router.put("/update-${args[0]}/many", validateIds, updateMany${capitalizedResourceName});

/**
 * @route PUT /api/v1/${args[0]}/update-${args[0]}/:id
 * @description Update ${args[0]} information
 * @param {string} id - The ID of the ${args[0]} to update
 * @access Public
 * @param {function} controller - ['update${capitalizedResourceName}']
 * @param {function} validation - ['validateId', 'validate${capitalizedResourceName}']
 */
router.put("/update-${args[0]}/:id", validateId, validate${capitalizedResourceName}, update${capitalizedResourceName});

/**
 * @route DELETE /api/v1/${args[0]}/delete-${args[0]}/many
 * @description Delete multiple ${args[0]}
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
 * @route GET /api/v1/${args[0]}/get-${args[0]}/many
 * @description Get multiple ${args[0]}
 * @access Public
 * @param {function} controller - ['getMany${capitalizedResourceName}']
 * @param {function} validation - ['validateIds']
 */
router.get("/get-${args[0]}/many", validateIds, getMany${capitalizedResourceName});

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

      // Path to the model directory
      const validationDir = path.join(__dirname, '..', 'src', 'modules', args[0]);
      // Create Zod validation schema content
      const validationContent = `
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating ${resourceName} data.
 */
const zod${capitalizedResourceName}Schema = z.object({
 // Define schema fields here
}).strict();

/**
 * Middleware function to validate ${resourceName} using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validate${capitalizedResourceName} = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zod${capitalizedResourceName}Schema.safeParse(req.body);

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
                  console.log(`${GREEN}${capitalizedResourceName} ${RESET}module already exists.`);
                } else if (missingFiles.length > 0 && missingFiles.length < expectedFiles.length) {
                  console.log(
                    `${GREEN}${capitalizedResourceName} ${RESET}module exists, but some files are missing:`
                  );
                  missingFiles.forEach((file, index) => console.log(`${index + 1}. ${file}`));

                  const answer = await askQuestion(
                    rl,
                    'Do you want to create missing files one by one (1) or all at once (2)? Enter 1 or 2: '
                  );

                  if (answer === '1') {
                    for (const file of missingFiles) {
                      const createFile = await askQuestion(
                        rl,
                        `Do you want to create ${file}? (yes/no) `
                      );
                      if (createFile.toLowerCase() === 'yes' || createFile.toLowerCase() === 'y') {
                        await createSingleFile(modulePath, file, moduleName);
                      }
                    }
                  } else if (answer === '2') {
                    await createAllFiles(modulePath, missingFiles, moduleName);
                  } else {
                    console.log('Invalid option. No files will be created.');
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
          `${GREEN}CREATE ${RESET}${formatPath(filePath)} ${BLUE}(${Buffer.byteLength(content, 'utf8')} bytes)`
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
          console.log('Please provide a module name.');
          return;
        }

        const found = await searchFile(srcPath, moduleName);
        if (!found) {
          console.log(`Module ${moduleName} not found.`);
        }
      })();
    });

  program.parse(process.argv);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
