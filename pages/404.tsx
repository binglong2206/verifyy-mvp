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
        <iframe
          src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0Fnc8xf76KEvpTtT7p52o9yaswXqKXY9XgRSQUrjCtsHxRUCdUXEm17fHwqYN61P9l%26id%3D101831578066144&show_text=false&width=500"
          width="500"
          height="497"
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
        <iframe
          src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid021DkqYqDWrUGV4nNK9RJoApSAhDQoYYaAUMU8kzravHaag6122CAn9niCuV6yKiUDl%26id%3D101831578066144&show_text=true&width=500"
          width="500"
          height="696"
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      </main>
    </div>
  );
};

export default Home;
