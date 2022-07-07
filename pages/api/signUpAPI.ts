// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { User } from "../../db/entity/User";
import { AppDataSource } from "../../db/data-source";
import bcrypt from "bcrypt";
import { resolveNaptr } from "dns";
import next from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") throw new Error("No Access");

    await AppDataSource.initialize().then(async () => {
      // Assume form already validated
      const { firstname, username, password, email } = req.body;

      // Check if user already exist
      const user = await User.findOneBy({
        username: username,
      });
      if (user) throw Error("user already exist");

      // Add user & hashed password
      const newUser = new User();
      newUser.firstname = firstname;
      newUser.username = username;
      newUser.email = email;

      const hashed = bcrypt.hashSync(password, 10);
      if (!hashed) throw Error("something went wrong");
      newUser.hashed_password = hashed;

      await AppDataSource.manager.save(newUser);

      // Sign JWT Token
      const accessToken = jwt.sign(
        { id: newUser.uuid, username: newUser.username },
        process.env.JWT_ACCESS_SECRET as string
      );
      const refreshToken = jwt.sign(
        { sessionId: 0, id: newUser.uuid, username: newUser.username },
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
  } catch (err) {
    await AppDataSource.destroy();
    console.error(err);
    res.status(400).end();
  }
}
