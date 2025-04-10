// File path: app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// You'll need to install the @mailchimp/mailchimp_marketing package:
// npm install @mailchimp/mailchimp_marketing
import mailchimp from "@mailchimp/mailchimp_marketing";

// Initialize Mailchimp with your API key
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., "us1"
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Add member to list
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
      email_address: email,
      status: "subscribed",
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle Mailchimp errors
    if (error.response && error.response.body) {
      // This is likely a Mailchimp API error
      const mcError = error.response.body;
      
      // If the user is already subscribed
      if (mcError.title === "Member Exists") {
        return NextResponse.json(
          { message: "You're already subscribed to our newsletter!" },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { message: mcError.title || "Error subscribing to newsletter" },
        { status: 400 }
      );
    }

    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}