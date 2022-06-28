import { sign } from "jsonwebtoken";

export class GenerateToken {
  async execute(userId: string) {
    const token = sign({}, "1e5e51fa-05e3-4fa1-af5a-15cd1b1a3b4b", {
      subject: userId,
      expiresIn: "20s",
    });

    return token;
  }
}
