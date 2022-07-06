import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getCookies } from "cookies-next";
import { useEffect, useState } from "react";
const axios = require("axios").default;

const Home: NextPage = () => {
  const [state, setState] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("api/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: "Timber", password: "1234" }),
    });

    const data = await res.json();
    console.log(data);
  };
  const viewDashboard = async () => {
    await fetch("api/access")
      .then((r) => r.text())
      .then((data) => console.log(data));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>PAGE2</h1>
      </main>
    </div>
  );
};

export default Home;
