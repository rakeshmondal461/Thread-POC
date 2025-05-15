import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { Request, Response } from "express";
import createGraphqlServer from "./graphql/index";
import UserService from "./services/user";

async function startServer() {
  const app = express();

  app.use(express.json());

  const gqlserver = await createGraphqlServer();
  app.use(
    "/graphql",
    expressMiddleware(gqlserver, {
      context: async ({ req, res }: ExpressContextFunctionArgument) => {
        const token = req.headers["token"];
        try {
          const user: any = UserService.decodeJWTToken(token as string);
          const userDet = await UserService.getUserById(user?.id);
          return { user: userDet };
        } catch (error) {
          return {};
        }
      },
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
