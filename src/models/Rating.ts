import { Schema, model, models } from "mongoose";

export interface IRating {
  _id: string;
  beerId: string;
  rating: number;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>({
  beerId: {
    type: String,
    required: [true, "Beer ID is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = models.Rating || model<IRating>("Rating", RatingSchema);

export default Rating;
