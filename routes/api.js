import express from 'express';
import Ninja from '../models/ninja.js'
import mongoose from "mongoose";
const router = express.Router();

// get a list of ninjas from the database 
router.get('/ninjas', async (req, res, next) => {
    try {
        const { lng, lat, maxDistance = 1000000000, unit = "m" } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ error: "please provide lng and lat " })
        }

        const parsedLng = parseFloat(lng);
        const parsedLat = parseFloat(lat)
        const parsedMax = parseInt(maxDistance, 10)

        if (Number.isNaN(parsedLng) || Number.isNaN(parsedLat)) {
            return res.status(400).json({ error: "lng and lat must be valids nos" })
        }

        const distanceMultiplier = unit === "km" ? 0.001 : 1;

        const pipeline = [
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parsedLng, parsedLat],     // the lng and lat you recieve are in string form so we have  to convert them to int 
                    },
                    distanceField: "distance",   // 100 km radius 
                    spherical: true,
                    maxDistance: parsedMax, distanceMultiplier,
                }
            },
            {
                $project: {
                    name: 1,
                    rank: 1,
                    availability: 1,
                    geometry: 1,
                    distance: { $round: ["$distance", 2] },
                }
            }
        ]

        const results = await Ninja.aggregate(pipeline);

        res.status(200).json({
            success: true,
            count: results.length,
            unit: unit === "km" ? "km" : "m",
            data: results,
        });
    } catch (error) {
        next(error);
    }
})

// add a new ninja to db
router.post('/ninjas', async (req, res, next) => {
    try {
        const ninja = await Ninja.create(req.body)
        res.status(201).json(ninja);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                sucess: false,
                message: "Validation Failed",
                errors: error.errors
            })
        }
        next(error)
    }

})

// update a ninja in the db
router.put('/ninjas/:id', async (req, res, next) => {
    try {
        const ninja = await Ninja.findByIdAndUpdate(
            req.params.id,    // it takes the id from the URL of the ninja that we want to delete 
            req.body,       // it is the new data that i will send through the Postman
            { new: true, runValidators: true }   // By default, findByIdAndUpdate return the old document seting new:true returns updated doc
            // by default the mongoose does not Schema validations on updates  but if you add runValidators: true then it will check the update against the schema rules 
        )
        if (!ninja) {
            return res.status(404).json({ error: "Ninja not found" })
        }
        res.status(200).json({ message: "Ninja updated ", data: ninja })
    } catch (error) {
        console.log("hi error here")
        // console.log(error)
        next(error)  // forwading the error to the middleware 
    }
})

// delete a ninja from the db
router.delete('/ninjas/:id', async (req, res, next) => {
    try {
        const ninja = await Ninja.findByIdAndDelete(req.params.id);  // to delete one by id 
        // const ninjas = await Ninja.findOneAndDelete()  // to delete one by filter
        if (!ninja) {
            return res.status(404).json({ error: "Ninja not found(Ninja not in database)" })
        }
        res.status(200).json({ message: "Ninja deleted successfully", data: ninja })
    } catch (error) {
        next(error)
    }
})

// router.delete('/ninjas', async (req, res, next) => {
//     try {
//         // below is to identify what type of request user made 
//         console.log("Delete ALL /ninja called")
//         res.status(200).json({ type: 'DELETE', action: "delete all of /ninjas", data: ["user123"] })     // i have used the 200 html code insted of 204 because i cant recieve responce/data with the 204 code it is only for success not to return after success  
//     } catch (error) {
//         next(error)
//     }
// })




export default router;