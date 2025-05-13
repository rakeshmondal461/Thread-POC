import { ApolloServer } from "@apollo/server";
import { User } from "./user";

interface MyContext {
  // Add any context properties you need here
}

const typeDefs = `
  ${User.typeDefs}

  type Query {
    ${User.queries}
  }

  type Mutation {
    ${User.mutations}
  }
`;

const resolvers = {
  Query: {
    ...User.resolvers.queries,
  },
  Mutation: {
    ...User.resolvers.mutations,
  },
};

const createGraphqlServer = async () => {
  const gqlserver = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
  });

  await gqlserver.start();

  return gqlserver;
};

export default createGraphqlServer;
