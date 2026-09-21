import { Property } from "../Models/propertyModel.js";
import { Booking } from "../Models/bookingModel.js";

//createOrder : booking any property
const createOrder = async(req,res)=>{
    const {amount, propertyId, fromDate, toDate, guest} = req.body;

    //orderId
    const orderId = "order_" + Date.now();
    res.json({
        success: true,
        message: "Order created successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guest
    })

}

//verify payment function
// book fror 25, 26 august => function will do  1.save booking , 2.block dates that are already booked
const verifyPayment= async(req, res)=>{
    const {orderId, bookingDetails, forceStatus} = req.body;

    if(forceStatus === "success"){
        const paymentId = "pay_" + Date.now();

        //save booking part
        const newBooking = await Booking.create({
            user: req.user._id,
            property: bookingDetails.propertyId,
            price: bookingDetails.price,
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            guests: bookingDetails.guest,
            numberOfnights: bookingDetails.nights,
            paid: true
        });

        //tell property that those dates are taken
        const updatedProperty = await Property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push:{
                    currentBookings:{
                        bookingId: newBooking._id,
                        fromDate: bookingDetails.fromDate,
                        toDate: bookingDetails.toDate,
                        userId: req.user._id
                    }
                }
            },
            {new: true}
        );

        res.json({
            success: true,
            message: "Payment Successful, Booking confirmed!",
            paymentId,
            orderId,
            booking : newBooking
        });
    }else{
        res.status(400).json({
            success: false,
            message: "Payment Failed!",
            orderId
        });
    }
}

//get my bookings: booking history
const getUserBookings = async(req, res)=>{
    try {
        const bookings = await Booking.find({user: req.user._id});

        res.status(200).json({
            status: "success",
            data:{
                bookings
            }
        });

    }catch(error){
        res.status(401).json({
            status: "fail",
            message: error.message
        });
    }
}

//get one booking details
const getBookingDetails = async(req, res)=>{
    try {
        const bookings = await Booking.findById(req.params.bookingId);

        res.status(200).json({
            status: "success",
            data:{
                bookings
            }
        });

    }catch(error){
        res.status(401).json({
            status: "fail",
            message: error.message
        });
    }
}

export { getBookingDetails, getUserBookings, createOrder, verifyPayment };