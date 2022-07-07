import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Test: NextPage = () => {
  return (
    <h1>
      test
      <Link href="/">
        <button>click me</button>
      </Link>
    </h1>
  );
};

export default Test;
