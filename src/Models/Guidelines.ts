import { AutoIncrement, Column, DataType, Model, NotNull, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Guidelines extends Model {
  @PrimaryKey
  @NotNull
  @AutoIncrement
  @Column({
    allowNull: false,
  })
  id: number;

  @NotNull
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @NotNull
  @Column({
    type: 'vector(1536)',
    allowNull: false,
  })
  embeddings!: number[];
}
