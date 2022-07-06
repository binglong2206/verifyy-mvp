// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { User } from "../../db/entity/User";
import { AppDataSource } from "../../db/data-source";
import bcrypt from "bcrypt";
import { resolveNaptr } from "dns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") throw new Error("No Access");

    await AppDataSource.initialize().then(async () => {
      const { username, password } = req.body;

      // Verify username & password
      const user = await User.findOneBy({
        firstName: username,
      });
      if (user) throw new Error("user already exist");
      // const passwordCheck = await bcrypt.compare(password, "hasedpassword");
      // if (!passwordCheck) throw new Error("wrong username or password");

      const newUser = await new User();
      newUser.firstName = username;
      bcrypt.hash(password, 10, (err, res) => {
        newUser.lastName = res;
      });
      await AppDataSource.manager.save(newUser);

      // Sign JWT Token
      const accessToken = jwt.sign(
        { id: newUser.id, username: newUser.firstName },
        process.env.JWT_ACCESS_SECRET as string
      );
      const refreshToken = jwt.sign(
        { sessionId: 0, id: newUser.id, username: newUser.firstName },
        process.env.JWT_REFRESH_SECRET as string
      );

      // Set Cookie
      res.setHeader("Set-Cookie", [
        serialize("accessToken", accessToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          sameSite: true,
          secure: true,
          path: "/",
        }),
        serialize("refreshToken", refreshToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          sameSite: true,
          secure: true,
          path: "/",
        }),
      ]);
    });

    await AppDataSource.destroy().then(() => res.end());
  } catch (e) {
    console.error(e);
    res.end();
  }
}
