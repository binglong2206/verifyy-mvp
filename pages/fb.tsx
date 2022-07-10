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
  const ig_url = `https://www.facebook.com/v14.0/dialog/oauth?client_id=605443167544553&scope=instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement&redirect_uri=http://localhost:3000/api/fb_oa`;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <h1>fb</h1>
          <button onClick={googleSignIn}>Google</button>
          <Link href={"api"}>
            <button>Instagram</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Login;
