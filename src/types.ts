
export interface Cabin {
    id?: number; 
    created_at?: string; 
    name: string; 
    maxCap: number; 
    regularPrice: number; 
    discount: number; 
    description: string; 
    image: any
  }
  
 
  export interface Booking {
    id: number; 
    created_at: string; 
    startDate: Date; 
    endDate: Date; 
    numNights: number; 
    numGuests: number; 
    cabinPrice: number; 
    extrasPrice: number; 
    totalPrice: number; 
    status: string; 
    hasBreakfast: boolean; 
    isPaid: boolean; 
    observations: string; 
    cabinId: number; 
    fullName: string; 
    email: string; 
    nationalID: string; 
    nationality: string; 
    cabins:Cabin
  }
  
export interface AuthUser {
    uid: string; 
    created_at: string; 
    email: string | null; 
    phone: string | null; 
    display_name:string|null;
    last_sign_in_at: string | null;
  }
  
  
  export interface Settings {
    id: number; 
    created_at: string; 
    minBookingLength: number;
    maxBookingLength: number; 
    maxGuests: number;
    breakfastPrice: number; 
  }
  
 
  export type SupabaseTableRow = Cabin | Booking | Settings;
  

  export interface Database {
    public: {
      Tables: {
        cabins: {
          Row: Cabin; 
          Insert: Omit<Cabin, "id" | "created_at">;
          Update: Partial<Cabin>;
        };
        bookings: {
          Row: Booking;
          Insert: Omit<Booking, "id" | "created_at">;
          Update: Partial<Booking>;
        };
        settings: {
          Row: Settings;
          Insert: Omit<Settings, "id" | "created_at">;
          Update: Partial<Settings>;
        };
      };
    };
  }
  