import { useSearchParams } from "react-router-dom";
import Select from "./Select";
import React from "react";

interface SortByProps {
  options: { value: string; label: string }[]; 
}

function SortBy({ options }:SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || options[0].value;
  function handleChange(e:React.ChangeEvent<HTMLSelectElement>) {
    const newSearchParams = new URLSearchParams(searchParams); 
    newSearchParams.set("sortBy", e.target.value);
    setSearchParams(newSearchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={sortBy}
    />
  );
}

export default SortBy;
