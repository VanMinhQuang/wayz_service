import { Module } from '@nestjs/common';
import { SchemasModule } from '../../infrastructure/persistence/mongoose/schemas/schemas.module';
import { PlacesController, MapController } from './presentation/http/places.controller';
import { PlacesService } from './application/places.service';
@Module({
  imports: [SchemasModule],
  controllers: [PlacesController, MapController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
