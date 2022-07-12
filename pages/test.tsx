import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getCookies } from "cookies-next";
import React, { useEffect, useState, useReducer } from "react";
import Router from "next/router";
import { loginFormReducer } from "../utils/formReducer";
const axios = require("axios").default;

interface signUpForm {
  username: "";
  password: "";
}

const Login: NextPage = () => {
  const requestCookie = async () => {
    await fetch("http://localhost:8000/cookie", {
      credentials: "include",
    }).then((r) => console.log(r));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>request cookie</h1>
        <button onClick={requestCookie}>Request Cookie</button>
      </main>
    </div>
  );
};

export default Login;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  console.log(context.req.cookies);

  const whatver = await fetch("http://localhost:8000/cookie", {
    credentials: "include",
    headers: {
      // "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + "username:password",
    },
  });

  return {
    props: {},
  };
};
