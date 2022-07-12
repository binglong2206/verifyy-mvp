import type { NextPage, GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import cookie from "cookie";
import authMiddleware from "../utils/auth";
import Router from "next/router";
import { useRouter } from "next/router";
import axios from "axios";
import beta_users from "../beta-users";

interface DashboardProp {
  id: number;
  username: string;
}

const Home: NextPage<DashboardProp> = ({ id, username }) => {
  const [data, setData] = useState<string>("No Access");
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    await fetch("http://localhost:8000/data", {
      credentials: "include",
    })
      .then((res) => res.text())
      .then((data) => setData(data))
      .catch(() => console.log("cannot connect"));
  };

  const logout = async () => {
    const res = await fetch("api/logout_api", {
      method: "DELETE",
      credentials: "include",
    });

    Router.push("/login");
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <main>
        <h1>PUBLIC DASHBOARD</h1>
        <h2>ID: {id}</h2>
        <h2>User: {username}</h2>
      </main>
    </div>
  );
};

export default Home;

// SSR processes that can pass props to page component, use this to check token
// This itself is like a server that listens to page request and return the page HTML with props
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug = context.params?.id;
  const user = beta_users.find((e) => e.username === slug);

  if (!user) {
    return {
      redirect: {
        destination: "/404",
      },
    };
  } else
    return {
      props: {
        id: user.id,
        username: user.username,
      },
    };
};
