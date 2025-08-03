import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { Guidelines } from './Models/Guidelines';
import { Message } from './Models/Message';
import { Reservation } from './Models/Reservation';
import { AgentService } from './Services/Agent/Agent.service';
import { ChatService } from './Services/Chat/Chat.service';
import { EmbeddingsGeneratorService } from './Services/Embeddings/EmbeddingsGenerator.service';
import { EmbeddingsSearchService } from './Services/Embeddings/EmbeddingsSearch.service';
import { GuidelinesCreatorService } from './Services/Guidelines/GuidelinesCreator.service';
import { CancelReservationService } from './Services/Reservations/CancelReservation.service';
import { CreateReservationService } from './Services/Reservations/CreateReservation.service';
import { FindReservationService } from './Services/Reservations/FindReservation.service';
import { UpdateReservationService } from './Services/Reservations/UpdateReservation.service';
import { TelegramAgent } from './Services/Telegram/TelegramAgent';
import { GetAllergensInfoTool } from './Services/Tools/GetAllergensInfo.tool';
import { CancelReservationTool } from './Services/Tools/Reservations/CancelReservation.tool';
import { CreateReservationTool } from './Services/Tools/Reservations/CreateReservation.tool';
import { FindReservationTool } from './Services/Tools/Reservations/FindReservation.tool';
import { UpdateReservationTool } from './Services/Tools/Reservations/UpdateReservation.tool';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      username: 'aiagentchallenge',
      password: 'EXAMPLEPASSWORD', //Example credentials, real ones must go in env file
      database: 'challenge',
      host: '127.0.0.1',
      port: 8000,
      models: [Guidelines, Message, Reservation],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    SequelizeModule.forFeature([Guidelines, Message, Reservation]),
  ],
  controllers: [AppController],
  providers: [
    EmbeddingsGeneratorService,
    EmbeddingsSearchService,
    GuidelinesCreatorService,
    ChatService,
    AgentService,
    GetAllergensInfoTool,
    CancelReservationTool,
    FindReservationTool,
    CreateReservationTool,
    UpdateReservationTool,
    CreateReservationService,
    UpdateReservationService,
    CancelReservationService,
    FindReservationService,
    TelegramAgent,
  ],
})
export class AppModule {}
