import { AutoIncrement, Column, DataType, Index, Model, NotNull, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Reservation extends Model {
  @PrimaryKey
  @NotNull
  @AutoIncrement
  @Column({
    allowNull: false,
  })
  id: number;

  @NotNull
  @Index
  @Column({
    allowNull: false,
  })
  clientNumber: string; //This will serve as a method for identifying the client

  @NotNull
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @NotNull
  @Column({
    allowNull: false,
  })
  people: number;

  @NotNull
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCancelled: boolean;

  @NotNull
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  additionalInfo: string;
}
