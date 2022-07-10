import { NextPage } from "next";
import data from "../testdata";

interface StaticPath {
  params: { id: string };
}

interface StaticProps {}

interface Params {
  id: string;
}

interface DashBoardProps {
  data: string;
}

const Blog: NextPage = ({ data }) => {
  return (
    <div>
      <h1>Check it out!</h1>
      <h1>{data}</h1>
      <br />
    </div>
  );
};

// Depending on the routes requested, send props to page
export async function getStaticProps({ params }) {
  const id = params.id;
  const data = await fetch(`http://localhost:3000/api/${id}`)
    .then((r) => r.json())
    .then((data) => data.data);

  return {
    props: { data },
  };
}

// Set static routes
export async function getStaticPaths() {
  let params: StaticPath[] = []; // {params: {id: ...}}
  data.blogs.map((el) => params.push({ params: { id: el.id } }));

  return {
    paths: params,
    fallback: true,
  };
}

export default Blog;
