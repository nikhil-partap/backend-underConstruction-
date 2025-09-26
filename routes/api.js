import express from "express";
import Ninja from "../models/ninja.js";
import mongoose from "mongoose";
import auth from "../MiddleWare/authMiddleware.js";
const router = express.Router();

// get a list of ninjas from the database
router.get("/ninjas", async (req, res, next) => {
  try {
    const {lng, lat, maxDistance = 1000000000, unit = "km"} = req.query;

    if (!lng || !lat) {
      return res.status(400).json({error: "please provide lng and lat "});
    }

    const parsedLng = parseFloat(lng);
    const parsedLat = parseFloat(lat);
    const parsedMax = parseInt(maxDistance, 10);

    if (Number.isNaN(parsedLng) || Number.isNaN(parsedLat)) {
      return res.status(400).json({error: "lng and lat must be valids nos"});
    }

    const distanceMultiplier = unit === "km" ? 0.001 : 1;

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parsedLng, parsedLat], // the lng and lat you recieve are in string form so we have  to convert them to int
          },
          distanceField: "distance", // 100 km radius
          spherical: true,
          maxDistance: parsedMax,
          distanceMultiplier,
        },
      },
      {
        $project: {
          name: 1,
          rank: 1,
          availability: 1,
          geometry: 1,
          distance: {$round: ["$distance", 2]},
        },
      },
    ];

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
});

// add a new ninja to db (protected)
router.post("/ninjas", auth, async (req, res, next) => {
  try {
    const ninja = await Ninja.create(req.body);
    res.status(201).json(ninja);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        sucess: false,
        message: "Validation Failed",
        errors: error.errors,
      });
    }
    next(error);
  }
});

// update a ninja in the db (protected)
router.put("/ninjas/:id", auth, async (req, res, next) => {
  try {
    const ninja = await Ninja.findByIdAndUpdate(
      req.params.id, // it takes the id from the URL of the ninja that we want to delete
      req.body, // it is the new data that i will send through the Postman
      {new: true, runValidators: true} // By default, findByIdAndUpdate return the old document seting new:true returns updated doc
      // by default the mongoose does not Schema validations on updates  but if you add runValidators: true then it will check the update against the schema rules
    );
    if (!ninja) {
      return res.status(404).json({error: "Ninja not found"});
    }
    res.status(200).json({message: "Ninja updated ", data: ninja});
  } catch (error) {
    console.log("hi error here");
    // console.log(error)
    next(error); // forwading the error to the middleware
  }
});

// delete a ninja from the db (protected)
router.delete("/ninjas/:id", auth, async (req, res, next) => {
  try {
    const ninja = await Ninja.findByIdAndDelete(req.params.id); // to delete one by id
    // const ninjas = await Ninja.findOneAndDelete()  // to delete one by filter
    if (!ninja) {
      return res
        .status(404)
        .json({error: "Ninja not found(Ninja not in database)"});
    }
    res.status(200).json({message: "Ninja deleted successfully", data: ninja});
  } catch (error) {
    next(error);
  }
});


// only use if you want to delete all the data of the database 
// router.delete("/ninjas", async (req, res, next) => {
//   try {
//     // if (req.query.confirm !== "true") {
//     //   return res.status(400).json({
//     //     error: "You must pass ?confirm=true to delete all ninjas"
//     //   });
//     // }

//     // actually delete
//     const result = await Ninja.deleteMany({});

//     // return number deleted (200 OK). You can also use 204 No Content but then no body allowed.
//     res.status(200).json({
//       success: true,
//       deletedCount: result.deletedCount
//     });
//   } catch (err) {
//     next(err);
//   }
// });


export default router;
