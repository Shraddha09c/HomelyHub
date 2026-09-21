//managing booking 
//store all booking
//store individual booking details
//track api loading status
//add new bookings when a booking is created
//update booking data when we recieve it from the backend 

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookings: [],
    bookingDetails: {},
    loading: false
}

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers:{
        setBookingRequest(state){
            state.loading= true
        },
        setBookings(state, action){
            state.bookings= action.payload;
            state.loading= false
        },
        addBookings:(state, action)=>{
            state.bookings.push(action.payload);
        },
        setBookingDetails:(state, action)=>{
            state.bookingDetails= action.payload.bookings;
        }
    }
})

export const { setBookings, addBookings, setBookingDetails } = bookingSlice.actions;
export default bookingSlice;