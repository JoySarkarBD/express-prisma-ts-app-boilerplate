import { Prisma } from '@prisma/client';

// Import the Prisma Client instance
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
const updateManyUser = async (data: { id: string; updates: Prisma.UserUpdateInput}[]) => {
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