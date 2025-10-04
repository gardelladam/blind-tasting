import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Rating from "@/models/Rating";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { beerId, rating } = body;

    if (!beerId || !rating) {
      return NextResponse.json(
        { error: "Beer ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const newRating = await Rating.create({ beerId, rating: Number(rating) });

    return NextResponse.json(
      {
        _id: newRating._id.toString(),
        beerId: newRating.beerId,
        rating: newRating.rating,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const ratingId = searchParams.get("id");

    if (!ratingId) {
      return NextResponse.json(
        { error: "Rating ID is required" },
        { status: 400 }
      );
    }

    await Rating.findByIdAndDelete(ratingId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Failed to delete rating" },
      { status: 500 }
    );
  }
}
