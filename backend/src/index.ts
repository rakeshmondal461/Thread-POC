import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { Request, Response } from "express";
import { prisma } from "./lib/db";

const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    profileImageUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    hello: String
    say(name: String!): String
  }

  type Mutation {
    createUser(email: String!, password: String!, firstName: String!, lastName: String!): User
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello World!",
    say: (_: unknown, { name }: { name: string }) => `Hey ${name}, How are you?`,
  },
  Mutation: {
    createUser: async (_: unknown, { email, password, firstName, lastName }: { email: string, password: string, firstName: string, lastName: string }) => {
      return await prisma.user.create({ data: { email, password, firstName, lastName } });
    }
  }
};

interface MyContext {
  // Add any context properties you need here
}

async function startServer() {
  const app = express();

  const gqlserver = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
  });

  await gqlserver.start();
  
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(gqlserver, {
      context: async ({ req, res }: ExpressContextFunctionArgument) => ({})
    }) as unknown as express.RequestHandler
  );
  const port = Number(process.env.PORT) || 8000;

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
