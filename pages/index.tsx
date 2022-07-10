import type { NextPage, GetServerSidePropsContext } from "next";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState, useReducer } from "react";
import Link from "next/link";

const Login: NextPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <h3>Connect ur youtube!</h3>
          <Link href="api/yt_oauth">
            <button>youtube</button>
          </Link>
          <h3>Connect ur Instagram!</h3>
          <Link href="api/fb_oauth">
            <button onClick={() => setLoading(true)}>instagram</button>
          </Link>
        </div>
        <div>{loading ? <h1>loading...</h1> : null}</div>
        <div>hey</div>
      </main>
    </div>
  );
};

export default Login;
