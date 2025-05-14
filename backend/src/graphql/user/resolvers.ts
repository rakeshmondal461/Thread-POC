import UserService, { CreateUserPayload } from "../../services/user";

const queries = {};
const mutations = {
  createUser: async (_: unknown, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    console.log(res);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
