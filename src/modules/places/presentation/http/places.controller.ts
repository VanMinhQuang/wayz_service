import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, JwtUser } from '../../../../shared/presentation/http/auth';
import {
  CreateReviewDto,
  GeocodeQueryDto,
  NearbyQueryDto,
  RouteQueryDto,
  SearchPlacesDto,
} from './places.dto';
import { PlacesService } from '../../application/places.service';
@ApiTags('places')
@Controller({ path: 'places', version: '1' })
export class PlacesController {
  constructor(private readonly places: PlacesService) {}
  @Get('categories') categories() {
    return this.places.categoriesList();
  }
  @Get('nearby') nearby(@Query() dto: NearbyQueryDto) {
    return this.places.nearby(dto);
  }
  @Get('search') search(@Query() dto: SearchPlacesDto) {
    return this.places.search(dto);
  }
  @Get(':id') detail(@Param('id') id: string) {
    return this.places.findPlace(id);
  }
  @Get(':id/reviews') reviews(@Param('id') id: string) {
    return this.places.reviewsList(id);
  }
  @Get(':id/route') route(@Param('id') id: string, @Query() dto: RouteQueryDto) {
    return this.places.route(id, dto);
  }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Post(':id/reviews') review(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.places.upsertReview(user.sub, id, dto);
  }
}
@ApiTags('map')
@Controller({ path: 'map', version: '1' })
export class MapController {
  constructor(private readonly places: PlacesService) {}
  @Get('geocode') geocode(@Query() dto: GeocodeQueryDto) {
    return this.places.geocode(dto);
  }
}
