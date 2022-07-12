import type { NextPage, GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import cookie from "cookie";
import authMiddleware from "../utils/auth";
import Router from "next/router";
import { useRouter } from "next/router";
import axios from "axios";

interface HomeProps {
  id: number;
  username: string;
}

const Home: NextPage<HomeProps> = ({ id, username }) => {
  const [data, setData] = useState<string>("No Access");
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    await fetch("http://localhost:8000/data", {
      credentials: "include",
    })
      .then((res) => res.text())
      .then((data) => setData(data))
      .catch(() => console.log("cannot connect"));
  };

  const logout = async () => {
    const res = await fetch("api/logout_api", {
      method: "DELETE",
      credentials: "include",
    });

    Router.push("/login");
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>DASHBOARD</h1>
        <h2>User: {username}</h2>
        <h2>Data: {data}</h2>
        <button onClick={logout}>Logout</button>
        <div>
          <h3>Connect to Youtube</h3>
          <Link href="/api/yt_oauth">
            <button>youtube</button>
          </Link>
          <h3>Connect to Instagram</h3>
          <Link href="/api/fb_oauth">
            <button onClick={() => setLoading(true)}>instagram</button>
          </Link>
          <h3>Connect to Facebook</h3>
          <Link href="/api/fb_oauth">
            <button onClick={() => setLoading(true)}>facebook</button>
          </Link>
          <h3>TikTok coming soon....</h3>
          <Link href="/api/fb_oauth">
            <button disabled={true}>instagram</button>
          </Link>
        </div>
        <div>{loading ? <h1>loading...</h1> : null}</div>
      </main>
    </div>
  );
};

export default Home;

// SSR processes that can pass props to page component, use this to check token
// This itself is like a server that listens to page request and return the page HTML with props
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug = context.params?.id;

  if (!context.req.headers.cookie) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  const { accessToken, refreshToken } = cookie.parse(
    context.req.headers.cookie as string
  );
  const serverProps = await authMiddleware(
    accessToken,
    refreshToken,
    context,
    slug as string
  );
  return serverProps;
};
