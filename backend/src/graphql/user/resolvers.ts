import { prisma } from "../../lib/db";

const queries = {};
const mutations = {
  createUser: async (
    _: unknown,
    {
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }
  ) => {
    return await prisma.user.create({
      data: { email, password, firstName, lastName },
    });
  },
};

export const resolvers = { queries, mutations };
