import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";

const Home = () => {
  const { id } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getGroup(id),
    refetchOnWindowFocus: false,
  });
  async function getGroup(id) {
    const res = await axios.get(`http://localhost:5050/home/${id}`);
    const data = await res.data;
    console.log(data);
    return data;
  }
  return (
    <>
      <Header />
      {isLoading ? <p>Loading...</p> : <p>{data.message}</p>}
    </>
  );
};

export default Home;
