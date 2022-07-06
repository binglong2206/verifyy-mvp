import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getCookies } from "cookies-next";
import { useEffect, useState } from "react";
import Router from "next/router";
const axios = require("axios").default;

const Login: NextPage = () => {
  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // this stops it from submitting the form
    await fetch("api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username: "Timber", password: "123" }),
      credentials: "include",
    }).then(() => Router.push("/dashboard"));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <form onSubmit={formSubmit}>
          <label htmlFor="username">username</label>
          <input id="username" name="username" type="text" />
          <label htmlFor="password">password</label>
          <input id="password" name="password" type="text" />
          <button>Login</button>
        </form>
      </main>
    </div>
  );
};

export default Login;
