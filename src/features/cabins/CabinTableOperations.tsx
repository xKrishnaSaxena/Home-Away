import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import React from "react";
import { useSearchParams } from "react-router-dom";

function CabinTableOperations() {

  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-des", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by Price Ascending" },
          { value: "regularPrice-des", label: "Sort by Price Descending" },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
