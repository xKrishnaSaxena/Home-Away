import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

interface Booking{
  totalPrice:number;
  created_at:Date
  extrasPrice:number
}

interface Stay{
  id:number;
  status:string
  numNights:number
}
interface StatsProps{
  bookings:Booking[];
  confirmedStays:Stay[];
  nDays:number;
  nCabins:number;
}

function Stats({ bookings, confirmedStays, nDays, nCabins }:StatsProps) {
  const numBookings = bookings.length;
  const sales = bookings.reduce((a, b) => a + b.totalPrice, 0);
  const checkins = confirmedStays.length;
  const occupancy =
    confirmedStays.reduce((a, b) => a + b.numNights, 0) / (nDays * nCabins);
  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="red"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupancy * 100) + "%"}
      />
    </>
  );
}

export default Stats;
