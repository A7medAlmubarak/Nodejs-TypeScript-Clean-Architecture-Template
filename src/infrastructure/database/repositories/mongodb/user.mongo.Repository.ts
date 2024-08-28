// src/infrastructure/database/repositories/MongoDBUserRepository.ts
/*import { Collection, MongoClient } from 'mongodb';
import { User } from '../../../../domain/entities/User';
import { UserRepositoryInterface } from '../../../../domain/interfaces/UserRepositoryInterface';

export class MongoDBUserRepository implements UserRepositoryInterface {
    private collection: Collection<User>;

    constructor(collection: Collection<User>) {
        this.collection = collection;
    }

    async createUser(user: User): Promise<User> {
        const result = await this.collection.insertOne(user);
        return result.ops[0];
    }

    async getUserById(id: number): Promise<User | undefined> {
        return await this.collection.findOne({ id });
    }

    // Other repository methods can be implemented here
}
*/