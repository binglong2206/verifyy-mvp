import type { NextPage, GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import cookie from "cookie";
import authMiddleware from "../utils/auth";
import Router from "next/router";

const Redirect_edit: NextPage = () => {
  useEffect(() => {
    Router.push("/edit");
  });

  return <></>;
};

export default Redirect_edit;
