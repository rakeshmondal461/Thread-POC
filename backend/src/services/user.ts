import { createHmac, randomBytes } from "crypto";
import { prisma } from "../lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = "f4a28fb4ee0f7f55212160dd2aec8206";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export type getUserTokenPayload = Omit<CreateUserPayload, "firstName" | "lastName">;

class UserService {
  private static generateHashPassword(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString();
    const hashedPassword = UserService.generateHashPassword(salt, password);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName: lastName,
        salt,
      },
    });
  }

  public static async getUserToken(payload: getUserTokenPayload) {
    const { email, password } = payload;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) throw new Error("Invalid email or password");

    const userSalt = user.salt;
    const userHashedPassword = UserService.generateHashPassword(
      userSalt,
      password
    );
    if (userHashedPassword !== user.password)
      throw new Error("Invalid email or password");

    const token = jwt.sign({id:user.id,email:user.email},JWT_SECRET);
    return token;
  }
}

export default UserService;
