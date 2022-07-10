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
      console.log(username, password);
      // Verify username & password
      const user = await User.findOneBy({
        username: username,
      });
      if (!user) throw new Error("wrong username");
      const passwordCheck = await bcrypt.compare(
        password,
        user.hashed_password
      );
      if (!passwordCheck) throw Error("wrong password");

      // Sign JWT Token
      const accessToken = jwt.sign(
        { id: user.uuid, username: user.username },
        process.env.JWT_ACCESS_SECRET as string
      );
      const refreshToken = jwt.sign(
        { sessionId: 0, id: user.uuid, username: user.username },
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

    await AppDataSource.destroy().then(() =>
      res.status(200).json({
        ok: true,
      })
    );
  } catch (err) {
    await AppDataSource.destroy();
    console.error(err);
    res.status(401).json(err);
  }
}
