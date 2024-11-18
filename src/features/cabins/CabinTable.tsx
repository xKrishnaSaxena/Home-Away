import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import { Cabin } from "../../types";
import { formatCurrency } from "../../utils/helpers";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { useState } from "react";

interface CompareCabinsModalTypes{
  cabins?:Cabin[]
  onClose:()=>void;
}


function CompareCabinsModal({ cabins = [], onClose }:CompareCabinsModalTypes) {
  if (cabins.length === 0) return null; 

  return (
    <Modal onClose={onClose}>
      <h2>Compare Cabins</h2>
      <Table columns="1fr 1fr 1fr">
        <Table.Header>
          {cabins.map((cabin) => (
            <div key={cabin.id}>{cabin.name}</div>
          ))}
        </Table.Header>
        <Table.Body
          data={[
            { label: 'Capacity', values: cabins.map(cabin => `Capacity: ${cabin.maxCap}`) },
            { label: 'Price', values: cabins.map(cabin => `Price: ${formatCurrency(cabin.regularPrice)}`) },
            { label: 'Discount', values: cabins.map(cabin => `Discount: ${cabin.discount > 0 ? formatCurrency(cabin.discount) : "None"}`) },
          ]}
          render={(row: { label: string; values: string[] }) => (
            <Table.Row key={row.label}>
              {row.values.map((value, i) => (
                <div key={i}>{value}</div>
              ))}
            </Table.Row>
          )}
        />
      </Table>
      <Button onClick={onClose}>Close Comparison</Button>
    </Modal>
  );
}


function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();
  const [compareCabins,setCompareCabins]=useState<Cabin[]>([]);
  if (isLoading) return <Spinner />;

  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabins;
  
  if (filterValue === "no-discount") {
    if(cabins){
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  }}
  if (filterValue === "with-discount") {
    if(cabins){

    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
    }
  }
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  if(filteredCabins){
  if (sortBy === "name-asc") {
    filteredCabins.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-des") {
    filteredCabins.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === "regularPrice-asc") {
    filteredCabins.sort((a, b) => a.regularPrice - b.regularPrice);
  } else if (sortBy === "regularPrice-des") {
    filteredCabins.sort((a, b) => b.regularPrice - a.regularPrice);
  }
  }
  function handleToggleCompare(cabin:Cabin)
  {
    setCompareCabins((prev)=>
      prev.includes(cabin)?prev.filter((c)=>c.id!==cabin.id):[...prev,cabin]
    );
  }
 
  

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        {cabins &&   <Table.Body
          data={filteredCabins||[]}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} onToggleCompare={handleToggleCompare} isSelectedForCompare={compareCabins.includes(cabin)}/>}
        />}
      </Table>
      {compareCabins.length>1&&(
        <CompareCabinsModal cabins={compareCabins} onClose={()=>setCompareCabins([])}/>
      )}
    </Menus>
  );
}

export default CabinTable;
