import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({ showBeerNames: false });
    }

    return NextResponse.json({
      showBeerNames: settings.showBeerNames,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { showBeerNames } = body;

    if (showBeerNames === undefined) {
      return NextResponse.json(
        { error: "showBeerNames is required" },
        { status: 400 }
      );
    }

    let settings = await Settings.findOne({});

    if (!settings) {
      settings = await Settings.create({ showBeerNames });
    } else {
      settings.showBeerNames = showBeerNames;
      await settings.save();
    }

    return NextResponse.json({
      showBeerNames: settings.showBeerNames,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
