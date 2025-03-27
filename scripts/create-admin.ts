import dotenv from "dotenv";
import * as readline from "readline";
import fetch from "node-fetch"; // Changed to default import

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for input
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      resolve(answer);
    });
  });
}

async function createAdmin(): Promise<void> {
  try {
    console.log("\n=== CREATE INITIAL ADMIN USER ===\n");

    if (!process.env.ADMIN_CREATION_KEY) {
      console.error(
        "Error: ADMIN_CREATION_KEY not set in environment variables"
      );
      console.log("Please set this in your .env file and try again");
      return;
    }

    const name = await prompt("Admin name: ");
    const email = await prompt("Admin email: ");
    const password = await prompt("Admin password (min 8 characters): ");

    if (!name || !email || !password) {
      console.error("Error: All fields are required");
      return;
    }

    if (password.length < 8) {
      console.error("Error: Password must be at least 8 characters");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    console.log("\nCreating admin user...");

    const response = await fetch(`${baseUrl}/api/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": process.env.ADMIN_CREATION_KEY || "",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = (await response.json()) as {
      error?: string;
      user?: { name: string; email: string; role: string };
    };

    if (!response.ok) {
      console.error(`Error: ${data.error || "Unknown error"}`);
      return;
    }

    if (data.user) {
      console.log("\n✅ Admin user created successfully!");
      console.log(`Name: ${data.user.name}`);
      console.log(`Email: ${data.user.email}`);
      console.log(`Role: ${data.user.role}`);
      console.log(
        "\nYou can now login to the admin dashboard using these credentials."
      );
    } else {
      console.error("Error: Unexpected API response format");
    }
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
  } finally {
    rl.close();
  }
}

createAdmin();
