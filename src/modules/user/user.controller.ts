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
  // Call the service method to create multiple users and get the result
  const result = await userServices.createManyUser(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single user.
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
 * Controller function to handle the deletion of a single user.
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
 * Controller function to handle the retrieval of a single user by ID.
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