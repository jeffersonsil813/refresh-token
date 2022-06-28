import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { prismaClient } from "../../database/prismaClient";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";
import { GenerateToken } from "../../provider/GenerateToken";

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

    // Gera o token do usuário
    const generateTokenProvider = new GenerateToken();
    const token = await generateTokenProvider.execute(userAlreadyExists.id);

    await prismaClient.refreshToken.deleteMany({
      where: {
        userId: userAlreadyExists.id,
      },
    });

    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(
      userAlreadyExists.id
    );

    return { token, refreshToken };
  }
}
