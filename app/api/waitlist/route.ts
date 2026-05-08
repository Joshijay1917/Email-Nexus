import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import fs from "fs";
import path from "path";

// Helper to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 254;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const mongoConnection = await connectToDatabase();

    if (mongoConnection) {
      const { db } = mongoConnection;
      const collection = db.collection("waitlist");

      // Check if email already exists
      const existingUser = await collection.findOne({ email: cleanEmail });
      if (existingUser) {
        // Return friendly success indicating they are already registered
        return NextResponse.json({
          success: true,
          message: "You are already on the waitlist! We will notify you.",
          alreadyRegistered: true,
          position: 124 + (await collection.countDocuments()),
        });
      }

      // Insert new waitlist subscriber
      await collection.insertOne({
        email: cleanEmail,
        createdAt: new Date(),
        source: "ghost_landing_page",
      });

      const totalCount = await collection.countDocuments();
      const position = 154 + totalCount;

      return NextResponse.json({
        success: true,
        message: "Successfully joined the waitlist!",
        position,
      });
    } else {
      // Fallback to local file storage if MongoDB is not connected
      console.log("Using local JSON file storage fallback for waitlist...");
      const dataDir = path.join(process.cwd(), "data");
      const filePath = path.join(dataDir, "waitlist.json");

      // Ensure directory exists
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      let waitlist: Array<{ email: string; createdAt: string; source: string }> = [];

      if (fs.existsSync(filePath)) {
        try {
          const fileData = fs.readFileSync(filePath, "utf-8");
          waitlist = JSON.parse(fileData);
        } catch (e) {
          console.error("Error reading fallback waitlist file:", e);
        }
      }

      const existingIndex = waitlist.findIndex((item) => item.email === cleanEmail);
      if (existingIndex !== -1) {
        return NextResponse.json({
          success: true,
          message: "You are already on the waitlist! We will notify you.",
          alreadyRegistered: true,
          position: 124 + waitlist.length,
        });
      }

      waitlist.push({
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        source: "ghost_landing_page",
      });

      fs.writeFileSync(filePath, JSON.stringify(waitlist, null, 2), "utf-8");

      const position = 154 + waitlist.length;

      return NextResponse.json({
        success: true,
        message: "Successfully joined the waitlist! (Local fallback)",
        position,
      });
    }
  } catch (error) {
    console.error("Error handling waitlist submission:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
