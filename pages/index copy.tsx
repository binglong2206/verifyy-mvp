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

    await fetch("api/loginAPI", {
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

  /*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
  async function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
      client_id:
        "284320772177-9it3a6skjshvpeu4nvpeknp6nq8ko8h2.apps.googleusercontent.com",
      redirect_uri: "http://localhost:3000",
      response_type: "token",
      scope: "https://www.googleapis.com/auth/yt-analytics.readonly",
      include_granted_scopes: "true",
      state: "pass-through value",
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  const getData = async () => {
    var params = JSON.parse(localStorage.getItem("google-oauth"));

    await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?access_token=${params["access_token"]}`
    ).then((r) => console.log(r));
  };

  useEffect(() => {
    var fragmentString = location.hash.substring(1);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = regex.exec(fragmentString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
      localStorage.setItem("google-oauth", JSON.stringify(params));
    }
  });

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
        <div>
          {/* <Link href="/">
            <button>Google</button>
          </Link> */}
          <button onClick={oauthSignIn}>oauth</button>
          <button onClick={getData}>fetch data</button>
        </div>
      </main>
    </div>
  );
};

export default Login;
