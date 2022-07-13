import type { NextPage, GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import cookie from "cookie";
import authMiddleware from "../utils/auth";
import Router from "next/router";

interface HomeProps {
  id: number;
  username: string;
}

const Home: NextPage<HomeProps> = ({ id, username }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>404</h1>
      </main>
    </div>
  );
};

export default Home;
