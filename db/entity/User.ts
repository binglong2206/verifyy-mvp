import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "character varying" })
  firstName: string;

  @Column({ type: "character varying" })
  lastName: string;

  @Column({ type: "integer", nullable: true })
  age: number | null;
}
