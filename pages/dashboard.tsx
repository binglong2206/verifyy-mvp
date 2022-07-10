import type { NextPage, GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import cookie from "cookie";
import { json } from "stream/consumers";
import authMiddleware from "../utils/auth";
import { getCookies } from "cookies-next";
import Router from "next/router";

const axios = require("axios").default;

interface HomeProps {
  id: number;
  username: string;
}

const Home: NextPage<HomeProps> = ({ id, username }) => {
  const [data, setData] = useState<string>("No Access");

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
