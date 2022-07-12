import type { NextPage, GetServerSidePropsContext } from "next";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState, useReducer } from "react";
import Link from "next/link";

const Login: NextPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>HomePage</h1>
        <Link href={"/edit"}>
          <button>go to App</button>
        </Link>
      </main>
    </div>
  );
};

export default Login;
