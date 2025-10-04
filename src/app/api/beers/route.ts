import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Beer from "@/models/Beer";
import Rating from "@/models/Rating";

export async function GET() {
  try {
    await dbConnect();
    const beers = await Beer.find({}).sort({ createdAt: 1 });

    // Get ratings for each beer
    const beersWithRatings = await Promise.all(
      beers.map(async (beer) => {
        const ratings = await Rating.find({ beerId: beer._id.toString() });
        return {
          _id: beer._id.toString(),
          name: beer.name,
          price: beer.price,
          alcoholPercentage: beer.alcoholPercentage,
          imageUrl: beer.imageUrl,
          ratings: ratings.map((r) => ({
            _id: r._id.toString(),
            rating: r.rating,
          })),
        };
      })
    );

    return NextResponse.json(beersWithRatings);
  } catch (error) {
    console.error("Error fetching beers:", error);
    return NextResponse.json(
      { error: "Failed to fetch beers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, price, alcoholPercentage, imageUrl } = body;

    if (!name || price === undefined || alcoholPercentage === undefined) {
      return NextResponse.json(
        { error: "Name, price, and alcohol percentage are required" },
        { status: 400 }
      );
    }

    const beer = await Beer.create({
      name,
      price: Number(price),
      alcoholPercentage: Number(alcoholPercentage),
      imageUrl: imageUrl || undefined,
    });

    return NextResponse.json(
      {
        _id: beer._id.toString(),
        name: beer.name,
        price: beer.price,
        alcoholPercentage: beer.alcoholPercentage,
        imageUrl: beer.imageUrl,
        ratings: [],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating beer:", error);
    return NextResponse.json(
      { error: "Failed to create beer" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const beerId = searchParams.get("id");

    if (!beerId) {
      return NextResponse.json(
        { error: "Beer ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, price, alcoholPercentage, imageUrl } = body;

    if (!name || price === undefined || alcoholPercentage === undefined) {
      return NextResponse.json(
        { error: "Name, price, and alcohol percentage are required" },
        { status: 400 }
      );
    }

    const updatedBeer = await Beer.findByIdAndUpdate(
      beerId,
      {
        name,
        price: Number(price),
        alcoholPercentage: Number(alcoholPercentage),
        imageUrl: imageUrl || undefined,
      },
      { new: true }
    );

    if (!updatedBeer) {
      return NextResponse.json({ error: "Beer not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: updatedBeer._id.toString(),
      name: updatedBeer.name,
      price: updatedBeer.price,
      alcoholPercentage: updatedBeer.alcoholPercentage,
      imageUrl: updatedBeer.imageUrl,
    });
  } catch (error) {
    console.error("Error updating beer:", error);
    return NextResponse.json(
      { error: "Failed to update beer" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const beerId = searchParams.get("id");

    if (!beerId) {
      return NextResponse.json(
        { error: "Beer ID is required" },
        { status: 400 }
      );
    }

    // Delete all ratings for this beer
    await Rating.deleteMany({ beerId });

    // Delete the beer
    await Beer.findByIdAndDelete(beerId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting beer:", error);
    return NextResponse.json(
      { error: "Failed to delete beer" },
      { status: 500 }
    );
  }
}
