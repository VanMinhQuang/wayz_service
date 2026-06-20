import { Module } from '@nestjs/common'; import { PlacesModule } from '../places/places.module'; import { AdminController } from './presentation/http/admin.controller'; import { RolesGuard } from '../../shared/presentation/http/auth';
@Module({ imports: [PlacesModule], controllers: [AdminController], providers: [RolesGuard] }) export class AdminModule {}
