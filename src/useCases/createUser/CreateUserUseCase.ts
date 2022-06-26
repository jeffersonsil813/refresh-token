import { hash } from "bcryptjs";
import { prismaClient } from "../../database/prismaClient";

interface IUserRequest {
  name: string;
  password: string;
  username: string;
}

export class CreateUserUseCase {
  async execute({ name, password, username }: IUserRequest) {
    // Verifica se o usuário já existe
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        username,
      },
    });

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    }

    // Cadastra o usuário
    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name,
        username,
        password: passwordHash,
      },
    });

    return user;
  }
}
