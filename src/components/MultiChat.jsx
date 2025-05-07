import React, { useEffect } from "react";
import main from "../apis/google/calls/googlemultichat";

const MultiChat = () => {
  useEffect(() => {
    const fetchData = async () => {
      await main();
    };
    fetchData();
  }, []); //
  return <div>MultiChat</div>;
};

export default MultiChat;
