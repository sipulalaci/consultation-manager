import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Projects } from "../components/Projects/Projects";

const Home: NextPage = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   router.replace("/login");
  // }, []);

  return <Projects />;
};

export default Home;
