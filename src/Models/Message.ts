import { AutoIncrement, Column, DataType, Model, NotNull, PrimaryKey, Table } from 'sequelize-typescript';

const roles = ['user', 'assistant'] as const;
export type MessageRole = (typeof roles)[number];

@Table
export class Message extends Model {
  @PrimaryKey
  @NotNull
  @AutoIncrement
  @Column({
    allowNull: false,
  })
  id: number;

  @NotNull
  @Column({
    allowNull: false,
  })
  clientNumber: string; //This will serve as a method for identifying the client we're speaking with and will allow the ia to get context from db

  @NotNull
  @Column({
    type: DataType.ENUM,
    values: roles,
    allowNull: false,
  })
  role: MessageRole; //We will build the history with this model so we need all parts involved in the conversation

  @NotNull
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;
}
