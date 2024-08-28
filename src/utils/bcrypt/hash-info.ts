import bcrypt from 'bcrypt';

/**
 * Hashes the given data using bcrypt.
 *
 * @param {string} data - The data to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed data.
 */
const HashInfo = async (data: string) => {
  // Hash the data using bcrypt with a salt rounds value of 10
  return await bcrypt.hash(data, 10);
};

export default HashInfo;
