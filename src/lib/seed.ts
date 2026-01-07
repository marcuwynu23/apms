import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * Seeds default users for each role type if they don't exist
 */
export async function seedDefaultUsers() {
  try {
    const defaultUsers = [
      {
        name: "Main Administrator",
        email: "admin@example.com",
        password: "admin123",
        role: "Admin" as const,
      },
      {
        name: "Staff User",
        email: "staff@example.com",
        password: "staff123",
        role: "Staff" as const,
      },
      {
        name: "Auditor User",
        email: "auditor@example.com",
        password: "auditor123",
        role: "Auditor" as const,
      },
    ];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        });
        console.log(`✓ Created ${userData.role} user: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error("Error seeding default users:", error);
  }
}
