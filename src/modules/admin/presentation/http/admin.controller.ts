import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../../../../shared/presentation/http/auth';
import {
  CreateCategoryDto,
  CreatePlaceDto,
  UpdatePlaceDto,
} from '../../../places/presentation/http/places.dto';
import { PlacesService } from '../../../places/application/places.service';
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly places: PlacesService) {}
  @Post('categories') category(@Body() dto: CreateCategoryDto) {
    return this.places.createCategory(dto);
  }
  @Post('places') place(@Body() dto: CreatePlaceDto) {
    return this.places.createPlace(dto);
  }
  @Patch('places/:id') updatePlace(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.places.updatePlace(id, dto);
  }
  @Patch('reviews/:id/hide') hideReview(@Param('id') id: string) {
    return this.places.hideReview(id);
  }
}
