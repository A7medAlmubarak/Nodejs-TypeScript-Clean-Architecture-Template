import { connectToDatabase } from "../index";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { SpecialistProfile } from "../../../domain/entities/SpecialistProfile";
import { UserProfile } from "../../../domain/entities/UserProfile";

export async function seedUsers() {
  const client = await connectToDatabase();

  const users = [
    {
      email: "patient@gmail.com",
      password: "12345678",
      isActive: true,
      isBlocked: false,
      roleId: 0,
    },
    {
      email: "doctor@gmail.com",
      password: "12345678",
      isActive: true,
      isBlocked: false,
      roleId: 1,
    },
    {
      email: "spc@gmail.com",
      password: "12345678",
      isActive: true,
      isBlocked: false,
      roleId: 2,
    },
  ];
    
    let createdUser = [];

  for (const user of users) {
    const newUser = client.getRepository(User).create(user);
      await client.getRepository(User).save(newUser);
       createdUser.push(newUser);;
  }
        

    return createdUser;
}
