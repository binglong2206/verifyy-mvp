import type { NextPage, GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import cookie from "cookie";
import authMiddleware from "../utils/auth";
import Router from "next/router";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookies } from "cookies-next";
import { useUserStore } from "../state/useStore";
import date from "date-and-time";

interface HomeProps {
  id: number;
  username: string;
}

const Home: NextPage<HomeProps> = ({ id, username }) => {
  const email = useUserStore((state) => state.email);
  const setUserState = useUserStore((state) => state.setUserState);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    const res = await fetch("http://localhost:8000/logout", {
      method: "DELETE",
      credentials: "include",
    });

    Router.push("/");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      await fetch(`http://localhost:8000/dashboard/${id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const { email } = data;
          useUserStore.setState({ email: email });
        })
        // .then((data) => setUserState(data))
        .catch(() => console.log("cannot connect"));
    };
    fetchDashboard();
  });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>DASHBOARD</h1>
        <h2>ID: {id}</h2>
        <h2>User: {username}</h2>
        <h2>Email: {email}</h2>
        <button onClick={logout}>Logout</button>
        <div>{loading ? <h1>loading...</h1> : null}</div>
        <div>
          <h3>Connect to Youtube</h3>
          <button
            onClick={() => {
              setLoading(true);
              Router.push("/api/yt_oauth");
            }}
          >
            youtube
          </button>
          <Link href="/api/yt_oauth">
            <button onClick={() => setLoading(true)}>youtube2</button>
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
  const serverProps = await authMiddleware(accessToken, refreshToken, context);
  return serverProps;
};
