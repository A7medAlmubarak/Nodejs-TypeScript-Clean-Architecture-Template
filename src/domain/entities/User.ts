import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcrypt";

import { Otp } from "./Otp";
import { OAuth } from "./OAuth";
import { Notification } from "./Notification";
import { Message } from "./Message";
import { ChatRoom } from "./ChatRoom";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "username", type: "varchar", length: 255, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  googleId?: string;

  @Column({
    name: "email",
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({ name: "password", type: "text" })
  password!: string;

  @Column({ name: "isActive", default: false })
  isActive!: boolean;

  @Column({ name: "deletedAt", type: "date", nullable: true })
  deletedAt?: Date | null;


  @OneToOne(() => OAuth, (oAuth) => oAuth.user)
  oAuth?: OAuth;

  @OneToMany(() => Otp, (otp) => otp.user, { cascade: true })
  otps?: Otp[];

  @OneToMany(() => Notification, (notification) => notification.user, { cascade: true })
  notifications?: Notification[];

  @OneToMany(() => Message, (message) => message.user, { cascade: true })
  messages?: Message[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user, { cascade: true })
  chatRooms?: ChatRoom[];


  // Method to hash the password before inserting the entity
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with bcrypt
  }

  @BeforeInsert()
  async generateUsername() {
    // Derive the username from the email address
    const emailParts = this.email.split("@");
    this.username = emailParts[0];
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
