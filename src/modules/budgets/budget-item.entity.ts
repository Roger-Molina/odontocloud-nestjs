import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Budget } from "./budget.entity";
import { Treatment } from "../treatments/entities/treatment.entity";

@Entity("budget_items")
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  treatmentName: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  // Relations
  @Column()
  budgetId: number;

  @ManyToOne(() => Budget, (budget) => budget.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "budgetId" })
  budget: Budget;

  @Column({ nullable: true })
  treatmentId: number;

  @ManyToOne(() => Treatment, { eager: true, nullable: true })
  @JoinColumn({ name: "treatmentId" })
  treatment: Treatment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
