import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getCookies } from "cookies-next";
import React, { useEffect, useState, useReducer } from "react";
import Router from "next/router";
import { loginFormReducer } from "../utils/formReducer";
import Link from "next/link";
import { googleSignIn } from "../oauth/google";
import { localservices } from "googleapis/build/src/apis/localservices";
const axios = require("axios").default;

interface LoginForm {
  username: "";
  password: "";
}

const Login: NextPage = () => {
  useEffect(() => {
    async function getData() {
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

      if (localStorage.getItem("google-oauth")) {
        await fetch(
          `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2022-01-01&endDate=2022-02-22&metrics=views&dimensions=day&sort=day&access_token=${params["access_token"]}`
        )
          .then((res) => res.json())
          .then((data) => console.log(data));
      }
    }

    getData();
  }),
    [];

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <h1>yourre connected to google</h1>
          <button onClick={googleSignIn}>oauth</button>
        </div>
      </main>
    </div>
  );
};

export default Login;
