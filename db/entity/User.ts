import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: "character varying" })
  firstname: string;

  @Column({ type: "character varying", unique: true })
  username: string;

  @Column({ type: "character varying" })
  password: string;

  @Column({ type: "character varying", unique: true })
  email: string;
}
