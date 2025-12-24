import { Schema, model, models } from "mongoose";

export interface IBeer {
  _id: string;
  name: string;
  price?: number;
  alcoholPercentage?: number;
  imageUrl?: string;
  createdAt: Date;
}

const BeerSchema = new Schema<IBeer>({
  name: {
    type: String,
    required: [true, "Beer name is required"],
  },
  price: {
    type: Number,
    required: false,
  },
  alcoholPercentage: {
    type: Number,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Beer = models.Beer || model<IBeer>("Beer", BeerSchema);

export default Beer;
