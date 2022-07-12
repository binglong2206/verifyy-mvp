import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import cookie from "cookie";
import { serialize } from "v8";

interface AccessLoad {
  id: number;
  username: string;
}

interface RefreshLoad {
  sessionId: number;
  id: number;
  username: string;
}

interface ServerProps {
  props: {
    id: number;
    username: string;
  };
}

interface RedirectProps {
  redirect: {
    destination: string;
  };
}

//*********** Helper VERIFY BOTH ****************/
const authenticateJWT = async (
  accessToken: string,
  refreshToken: string,
  context: GetServerSidePropsContext
): Promise<ServerProps | RedirectProps> => {
  try {
    const access = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    ) as AccessLoad;
    const session = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as RefreshLoad;

    return {
      props: {
        id: access.id,
        username: access.username,
      },
    };
  } catch (e) {
    console.error("either access or refresh token is invalid");
    // Clear cookie if either token false
    context.res.setHeader("Set-Cookie", [
      cookie.serialize("accessToken", "clear", {
        path: "/",
        maxAge: 0,
      }),
      cookie.serialize("refreshToken", "clear", {
        path: "/",
        maxAge: 0,
      }),
    ]);

    return {
      redirect: {
        destination: "/login",
      },
    };
  }
};

//*********** Helper REFRESH ACCESS****************/
const refreshAccessToken = async (
  refreshToken: string,
  context: GetServerSidePropsContext
): Promise<ServerProps | RedirectProps> => {
  try {
    const session = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as RefreshLoad;

    const accessToken = jwt.sign(
      {
        id: session.id,
        username: session.username,
      },
      process.env.JWT_ACCESS_SECRET as string
    );

    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("accessToken", accessToken, {
        httpOnly: true,
        sameSite: true,
        secure: true,
        path: "/",
      })
    );

    return {
      props: {
        id: session.id,
        username: session.username,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
};

//*********** Helper CHECK SLUG ****************/
const checkSlug = (refreshToken: string, slug: string) => {
  const session = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as RefreshLoad;
  if (session.username === slug) {
    return true;
  } else return false;
};

export default async function authMiddleware(
  accessToken: string,
  refreshToken: string,
  context: GetServerSidePropsContext
) {
  if (!refreshToken) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  if (refreshToken && !accessToken) {
    const serverProps = await refreshAccessToken(refreshToken, context);
    return serverProps;
  }

  if (refreshToken && accessToken) {
    const serverProps = await authenticateJWT(
      accessToken,
      refreshToken,
      context
    );
    return serverProps;
  }
}
