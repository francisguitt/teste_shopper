
import React from "react";
import TripForm from "../components/TripForm";

const Home: React.FC = () => {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto   mt-20">
        <TripForm />
        <div className="mt-20 text-center">
          <p className="text-zinc-500 font-bold">
            Desafio técnico Shopper.com.br</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
