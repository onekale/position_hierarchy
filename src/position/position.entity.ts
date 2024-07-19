import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({nullable: true})
  parentId: number;

  @ManyToOne(() => Position, position => position.children)
  @JoinColumn({name: 'parentId'})
  parent: Position;

  @OneToMany(() => Position, position => position.parent)
  children: Position[];
}


