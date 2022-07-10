import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getCookies } from "cookies-next";
import React, { useEffect, useState, useReducer } from "react";
import Router from "next/router";
import { loginFormReducer } from "../utils/formReducer";
import Link from "next/link";
const axios = require("axios").default;

interface LoginForm {
  username: "";
  password: "";
}

const Login: NextPage = () => {
  const [state, dispatch] = useReducer(
    (state: LoginForm, param: any) => {
      return { ...state, ...param }; // merge initial state with dispatch params
    },
    {
      username: "",
      password: "",
    }
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ [name]: value });
  };

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // this stops it from submitting the form

    await fetch("api/login_api", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(state),
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          Router.push("/dashboard");
        } else throw Error("wrong username or password");
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={formSubmit}>
          <label htmlFor="username">username</label>
          <input
            id="username"
            name="username"
            onChange={handleInput}
            type="text"
          />
          <label htmlFor="password">password</label>
          <input
            id="password"
            name="password"
            onChange={handleInput}
            type="text"
          />
          <button>Login</button>
        </form>
        <Link href="/signup">
          <button>Signup</button>
        </Link>
      </main>
    </div>
  );
};

export default Login;
