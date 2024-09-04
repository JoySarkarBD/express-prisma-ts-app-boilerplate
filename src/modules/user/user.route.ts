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
  getManyUser
} from './user.controller';

//Import validation from corresponding module
import { validateUserId } from './user.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/user/create-user
 * @description Create a new user
 * @access Public
 * @param {function} controller - ['createUser']
 */
router.post("/create-user", createUser);

/**
 * @route POST /api/v1/user/create-user/many
 * @description Create multiple user
 * @access Public
 * @param {function} controller - ['createManyUser']
 */
router.post("/create-user/many", createManyUser);

/**
 * @route PUT /api/v1/user/update-user/many
 * @description Update multiple user information
 * @access Public
 * @param {function} controller - ['updateManyUser']
 */
router.put("/update-user/many", updateManyUser);

/**
 * @route PUT /api/v1/user/update-user/:id
 * @description Update user information
 * @param {string} id - The ID of the user to update
 * @access Public
 * @param {function} controller - ['updateUser']
 * @param {function} validation - ['validateUserId']
 */
router.put("/update-user/:id", validateUserId, updateUser);

/**
 * @route DELETE /api/v1/user/delete-user/many
 * @description Delete multiple user
 * @access Public
 * @param {function} controller - ['deleteManyUser']
 */
router.delete("/delete-user/many", deleteManyUser);

/**
 * @route DELETE /api/v1/user/delete-user/:id
 * @description Delete a user
 * @param {string} id - The ID of the user to delete
 * @access Public
 * @param {function} controller - ['deleteUser']
 * @param {function} validation - ['validateUserId']
 */
router.delete("/delete-user/:id", validateUserId, deleteUser);

/**
 * @route GET /api/v1/user/get-user/many
 * @description Get multiple user
 * @access Public
 * @param {function} controller - ['getManyUser']
 */
router.get("/get-user/many", getManyUser);

/**
 * @route GET /api/v1/user/get-user/:id
 * @description Get a user by ID
 * @param {string} id - The ID of the user to retrieve
 * @access Public
 * @param {function} controller - ['getUserById']
 * @param {function} validation - ['validateUserId']
 */
router.get("/get-user/:id", validateUserId, getUserById);

// Export the router
module.exports = router;