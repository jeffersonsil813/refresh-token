import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { prismaClient } from "../../database/prismaClient";

interface IUserAuth {
  username: string;
  password: string;
}

export class AuthenticateUserUseCase {
  async execute({ username, password }: IUserAuth) {
    // Verifica se o usuário existe
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        username,
      },
    });

    if (!userAlreadyExists) {
      throw new Error("User or password incorrect!");
    }

    // Verifica se a senha está correta
    const passwordMatch = await compare(password, userAlreadyExists.password);

    if (!passwordMatch) {
      throw new Error("User or password incorrect!");
    }

    // Gerar o token do usuário
    const token = sign({}, "1e5e51fa-05e3-4fa1-af5a-15cd1b1a3b4b", {
      subject: userAlreadyExists.id,
      expiresIn: "20s",
    });

    return { token };
  }
}
