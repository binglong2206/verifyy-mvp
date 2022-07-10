import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { uid } = router.query;

  return <p>Post: {uid}</p>;
};

export default Post;
