import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

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
        {cabins && <Table.Body
          data={filteredCabins || []}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />}
        
      </Table>
    </Menus>
  );
}

export default CabinTable;
