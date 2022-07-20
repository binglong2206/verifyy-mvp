import type { NextPage, GetServerSidePropsContext } from "next";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState, useReducer } from "react";

const axios = require("axios").default;

interface signUpForm {
  username: "";
  password: "";
}

const Login: NextPage = () => {
  const requestCookie = async () => {
    await fetch("http://localhost:8000/cookie", {
      credentials: "include",
    });
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

// SSR don't have cookies in itself, only avalible in the req.cookies
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  console.log(context.req.cookies);

  const whatver = await fetch("http://localhost:8000/cookie", {
    credentials: "include",
    // headers: {
    //   // "Access-Control-Allow-Origin": "*",
    //   Authorization: "Bearer " + "username:password",
    // },
  });

  return {
    props: {},
  };
};
