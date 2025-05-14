import UserService, {
  CreateUserPayload,
  getUserTokenPayload,
} from "../../services/user";

const queries = {
  getUserToken: async (_: unknown, payload: getUserTokenPayload) => {
    const toekn = await UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });
    console.log("toekn", toekn);
    return toekn;
  },
};
const mutations = {
  createUser: async (_: unknown, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    console.log(res);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
