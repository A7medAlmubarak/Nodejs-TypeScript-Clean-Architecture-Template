import { EntityManager } from "typeorm";
import { User } from "../../entities/User";

export interface IUserRepository {
  register(user: User, entityManager: EntityManager): Promise<User>;
  login(user: User): Promise<User | null>;
  findByEmail(userEmail: string): Promise<User | null>;
  findById(userId: number): Promise<User | null>;
  updateUser(record: User, entityManager?: EntityManager): Promise<User | null>;
}
