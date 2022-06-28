import dayjs from "dayjs";
import { prismaClient } from "../database/prismaClient";

export class GenerateRefreshToken {
  async execute(userId: string) {
    // unix gera um númerico
    const expiresIn = dayjs().add(15, "second").unix();

    const generateRefreshToken = await prismaClient.refreshToken.create({
      data: {
        userId,
        expiresIn,
      },
    });

    return generateRefreshToken;
  }
}
