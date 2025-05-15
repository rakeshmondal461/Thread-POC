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
  getCurrentLoggedInUser: async (_:unknown, parameters:unknown,context:any) => {
    console.log("context",context);
    if(context && context.user){
      return context.user;
    }
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
