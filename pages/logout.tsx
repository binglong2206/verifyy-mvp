import type { NextPage, GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
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

const Logout: NextPage<HomeProps> = ({ id, username }) => {
  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // this stops it from submitting the form
    const res = await fetch("api/logout_api", {
      method: "DELETE",
      credentials: "include",
    });

    Router.push("/login");
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>LOGOUT</h1>
        <form onSubmit={formSubmit}>
          <button>LOGOUT</button>
        </form>
      </main>
    </div>
  );
};

export default Logout;

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
