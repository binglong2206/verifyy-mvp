import type { NextPage, GetServerSidePropsContext } from "next";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState, useReducer } from "react";
import Link from "next/link";
import SideBar from "../theme/SideBar";

const Login: NextPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>HomePage</h1>
        <Link href={"/edit"}>
          <button>go to App</button>
        </Link>
        <button type="button" className="btn btn-warning">Warning</button>
        <div className="mt-5">yo</div>
        <SideBar />
      </main>
    </div>
  );
};

export default Login;
