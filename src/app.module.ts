import { Guidelines } from '@models/Guidelines';
import { Message } from '@models/Message';
import { Reservation } from '@models/Reservation';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AgentService } from '@services/Agent/Agent.service';
import { ChatService } from '@services/Chat/Chat.service';
import { EmbeddingsGeneratorService } from '@services/Embeddings/EmbeddingsGenerator.service';
import { EmbeddingsSearchService } from '@services/Embeddings/EmbeddingsSearch.service';
import { GuidelinesCreatorService } from '@services/Guidelines/GuidelinesCreator.service';
import { CancelReservationService } from '@services/Reservations/CancelReservation.service';
import { CreateReservationService } from '@services/Reservations/CreateReservation.service';
import { FindReservationService } from '@services/Reservations/FindReservation.service';
import { UpdateReservationService } from '@services/Reservations/UpdateReservation.service';
import { TelegramAgent } from '@services/Telegram/TelegramAgent';
import { GetAllergensInfoTool } from '@services/Tools/GetAllergensInfo.tool';
import { CancelReservationTool } from '@services/Tools/Reservations/CancelReservation.tool';
import { CreateReservationTool } from '@services/Tools/Reservations/CreateReservation.tool';
import { FindReservationTool } from '@services/Tools/Reservations/FindReservation.tool';
import { UpdateReservationTool } from '@services/Tools/Reservations/UpdateReservation.tool';
import { AppController } from './app.controller';

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
