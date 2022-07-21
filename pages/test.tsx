import type { NextPage, GetServerSidePropsContext } from "next";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState, useReducer } from "react";
import classNames from 'classnames';
import SideBar from "../theme/SideBar";
 

const axios = require("axios").default;

interface signUpForm {
  username: "";
  password: "";
}

const Login: NextPage = () => {

  return (
    <div className={styles.container}>
      <div
			className={classNames(
				'wrapper',
				{ 'wrapper-right-panel-active': true },
			)}>
        <SideBar />
        yo
		</div>
    </div>
  );
};

export default Login;


