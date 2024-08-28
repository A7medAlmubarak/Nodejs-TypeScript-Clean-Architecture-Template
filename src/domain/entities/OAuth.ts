import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("oAuths")
export class OAuth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  provider!: string;

  @Column({ name: "accessToken" })
  accessToken!: string;

  @Column({ name: "refreshToken" })
  refreshToken!: string;
    
  @Column({ name: "userId", nullable: false })
  userId!: number;

  @OneToOne(() => User, (user) => user.oAuth, { cascade: true })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user!: User;
}
