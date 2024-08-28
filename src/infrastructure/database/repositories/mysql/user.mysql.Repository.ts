import { User } from "../../../../domain/entities/User";
import { connectToDatabase } from "../../";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { DataSource, EntityManager } from "typeorm";
import bcrypt from "bcrypt";

export class UserMysqlRepository implements IUserRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }

  async register(input: any, entityManager: EntityManager): Promise<User> {
    const { email, password } = input;
    const record = entityManager.create(User, {
      email,
      password,
    });
    const savedUser = await entityManager.save(record);
    return savedUser;
  }

  async login(input: any): Promise<User | null> {
    const { email, password } = input;
    const repository = this.client.getRepository(User);
    const user = await repository.findOneBy({ email: email });
    if (!user) {
      throw {
        statusCode: 404,
        message: "Email or password is incorrect.",
      };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw {
        statusCode: 401,
        message: "Email or password is incorrect.",
      };
    }
    return user;
  }

  async findById(userId: number): Promise<User | null> {
    const repository = this.client.getRepository(User);
    const user = await repository.findOne({
      where: { id: userId },
      relations: ["wallet"],
    });

    return user;
  }

  async findByEmail(userEmail: string): Promise<User | null> {
    const repository = this.client.getRepository(User);
    const user = await repository.findOne({
      where: { email: userEmail },
      relations: ["wallet", "userProfile"],
    });
    return user;
  }

  async updateUser(
    record: User,
    entityManager?: EntityManager
  ): Promise<User | null> {
    if (entityManager) return await entityManager.save(User, record);

    return await this.client.getRepository(User).save(record);
  }

  async delete(userId: number): Promise<boolean> {
    const repository = this.client.getRepository(User);
    const user = await repository.findOneBy({ id: userId }); // Replace with appropriate ID field
    if (!user) {
      return false;
    }
    await repository.delete(userId);
    return true;
  }
}
