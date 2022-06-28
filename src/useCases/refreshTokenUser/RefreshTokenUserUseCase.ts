import dayjs from "dayjs";
import { prismaClient } from "../../database/prismaClient";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";
import { GenerateToken } from "../../provider/GenerateToken";

export class RefreshTokenUserUseCase {
  async execute(refresh_token: string) {
    const refreshToken = await prismaClient.refreshToken.findFirst({
      where: {
        id: refresh_token,
      },
    });

    if (!refreshToken) {
      throw new Error("Refresh token invalid!");
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresIn)
    );

    const generateToken = new GenerateToken();
    const token = await generateToken.execute(refreshToken.userId);

    if (refreshTokenExpired) {
      await prismaClient.refreshToken.deleteMany({
        where: {
          userId: refreshToken.userId,
        },
      });

      const generateRefreshToken = new GenerateRefreshToken();
      const newRefreshToken = await generateRefreshToken.execute(
        refreshToken.userId
      );

      return { token, refreshToken: newRefreshToken };
    }

    return { token };
  }
}
