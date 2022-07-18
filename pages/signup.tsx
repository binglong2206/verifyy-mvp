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
  const [state, dispatch] = useReducer(
    (state: signUpForm, param: any) => {
      return { ...state, ...param }; // merge initial state with dispatch params
    },
    {
      firstname: "",
      username: "",
      password: "",
      email: "",
    }
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch({ [name]: value });
  };

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // this stops it from submitting the form

    await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(state),
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          Router.push("/");
        } else throw Error("something went wrong");
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>SignUp</h1>
        <form onSubmit={formSubmit}>
          <label htmlFor="firstname">firstname</label>
          <input
            id="firstname"
            name="firstname"
            onChange={handleInput}
            type="text"
          />
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
          <label htmlFor="email">email</label>
          <input id="email" name="email" onChange={handleInput} type="text" />
          <button>Signup</button>
        </form>
      </main>
    </div>
  );
};

export default Login;
