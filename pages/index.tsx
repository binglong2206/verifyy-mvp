import type { NextPage, GetServerSidePropsContext } from "next";
import React from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getCookies } from "cookies-next";
import { useEffect, useState } from "react";
const axios = require("axios").default;

interface HomeProps {
  dog: string;
}

const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("submmited");
};

const Home: NextPage<HomeProps> = ({ dog }) => {
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

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      dog: "yo",
    },
  };
};
