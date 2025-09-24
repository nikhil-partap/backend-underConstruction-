import mongoose, {Schema} from "mongoose";

const GeoSchema = new Schema(
  {
    type: {
      type: String,
      default: "Point", // the ninjas are marked as a point on the map
    },
    coordinates: {
      type: [Number],
      // index: "2dsphere"     not working assigning the index on the whole geometry field not just coordinates
    },
  },
  {_id: false} // i dont want a seprate id for the subdoc
);

const NinjaSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    email:{
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
    },
    availability: {
      type: Boolean,
      default: false,
    },
    geometry: GeoSchema,
  },
  {timestamps: true}
);

// NinjaSchema.index({ geometry: "2dsphere" })     // assigning the index to whole geometry

export default mongoose.model("Ninja", NinjaSchema, "ninja");
