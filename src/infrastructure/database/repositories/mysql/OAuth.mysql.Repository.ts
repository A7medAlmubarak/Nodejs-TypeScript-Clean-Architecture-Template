import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { User } from "../../../../domain/entities/User";
import { IOAuthRepository } from "../../../../domain/interfaces/repositories/IOAuthRepository";
import { OAuth } from "../../../../domain/entities/OAuth";

export class OAuthMysqlRepository implements IOAuthRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  private async init() {
    this.client = await connectToDatabase();
  }

  async create(
    accessToken: string,
    refreshToken: string,
    user: User,
    entityManager?: EntityManager
  ): Promise<OAuth> {
    if (entityManager)
      return entityManager.save(OAuth, {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    const repository = this.client.getRepository(OAuth);
    const record = repository.save({
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    return record;
  }

  async findById(oAuthId: any): Promise<OAuth | null> {
    const repository = this.client.getRepository(OAuth);
    const oAuth = await repository.findOne({
      where: { id: oAuthId },
    });
    return oAuth;
  }

  async findByUser(user: User): Promise<OAuth | null> {
    const repository = this.client.getRepository(OAuth);
    const oAuth = await repository.findOne({
      where: { user: user },
    });
    return oAuth;
  }

  async update(
    oAuth: OAuth,
    entityManager?: EntityManager
  ): Promise<OAuth | null> {
    if (!entityManager) {
      entityManager = this.client.manager;
    }
    return await entityManager.save(OAuth, oAuth);
  }
}
