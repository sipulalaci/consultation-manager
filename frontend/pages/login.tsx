import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Login } from "../components/Login/Login";

const LoginPage: NextPage = () => {
  //   const router = useRouter();

  //   useEffect(() => {
  //     router.replace("/login");
  //   }, []);

  return <Login />;
};

export default LoginPage;
