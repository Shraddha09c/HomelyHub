//which property booked? user? price? dates? guest? paid?

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        property:{
            type: mongoose.Schema.ObjectId,
            ref: "Property",
            required: [true,"Booking must belong to a Property"]
        },
        user:{
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true,"Booking must belong to a User"]
        },
        price:{
            type: Number,
            required: [true, "booking must have a price"]
        },
        createdAt:{
            type: Date,
            default: Date.now()
        },
        paid:{
            type: Boolean,
            default: true,
        },
        fromDate:{
            type: Date
        },
        toDate:{
            type: Date
        },
        guest:{
            type: Number,

        },
        numberOfnights:{
            type: Number
        }
    },

    {timestamps: true}
);

bookingSchema.pre(/^find/, function(){
    this.populate("user");
    
        this.populate({
        path: "property",
        select: " maximumGuest images propertyName address "
    });
})

const Booking = mongoose.model("Booking", bookingSchema);

export { Booking };
