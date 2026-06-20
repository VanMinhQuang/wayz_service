import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, Place } from '../../../infrastructure/persistence/mongoose/schemas/place.schema';
import { Review } from '../../../infrastructure/persistence/mongoose/schemas/review.schema';
import { MapVinaService } from '../../../infrastructure/external/mapvina/mapvina.service';
import {
  CreateCategoryDto,
  CreatePlaceDto,
  CreateReviewDto,
  GeocodeQueryDto,
  NearbyQueryDto,
  RouteQueryDto,
  SearchPlacesDto,
  UpdatePlaceDto,
} from '../presentation/http/places.dto';
@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private readonly places: Model<Place>,
    @InjectModel(Category.name) private readonly categories: Model<Category>,
    @InjectModel(Review.name) private readonly reviews: Model<Review>,
    private readonly map: MapVinaService,
  ) {}
  categoriesList() {
    return this.categories.find({ active: true }).sort({ name: 1 });
  }
  async nearby(dto: NearbyQueryDto) {
    const filter: Record<string, unknown> = { active: true };
    if (dto.categoryId) filter.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.q) filter.$text = { $search: dto.q };
    if (dto.cursor) filter._id = { $lt: new Types.ObjectId(dto.cursor) };
    const rows = await this.places.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [dto.lng, dto.lat] },
          distanceField: 'distanceMeters',
          maxDistance: dto.radius,
          spherical: true,
          query: filter,
        },
      },
      { $limit: dto.limit + 1 },
    ]);
    return this.cursor(rows, dto.limit);
  }
  async search(dto: SearchPlacesDto) {
    const filter: Record<string, unknown> = { active: true, $text: { $search: dto.q } };
    if (dto.categoryId) filter.categoryId = dto.categoryId;
    if (dto.cursor) filter._id = { $lt: dto.cursor };
    const rows = await this.places
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, _id: -1 })
      .limit(dto.limit + 1);
    return this.cursor(rows, dto.limit);
  }
  private cursor(rows: any[], limit: number) {
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    return { data, nextCursor: hasMore ? data[data.length - 1]._id.toString() : null };
  }
  async findPlace(id: string) {
    const item = await this.places.findOne({ _id: id, active: true }).populate('categoryId');
    if (!item) throw new NotFoundException('Place not found');
    return item;
  }
  reviewsList(placeId: string) {
    return this.reviews
      .find({ placeId, visible: true })
      .populate('userId', 'fullName nickname avatarKey')
      .sort({ createdAt: -1 });
  }
  async upsertReview(userId: string, placeId: string, dto: CreateReviewDto) {
    await this.findPlace(placeId);
    const review = await this.reviews.findOneAndUpdate(
      { userId, placeId },
      { ...dto, userId, placeId },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    await this.refreshRating(placeId);
    return review;
  }
  private async refreshRating(placeId: string) {
    const [summary] = await this.reviews.aggregate([
      { $match: { placeId: new Types.ObjectId(placeId), visible: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await this.places.updateOne(
      { _id: placeId },
      { ratingAverage: summary?.average ?? 0, reviewCount: summary?.count ?? 0 },
    );
  }
  route(placeId: string, dto: RouteQueryDto) {
    return this.findPlace(placeId).then((place) =>
      this.map.route(
        { lat: dto.originLat, lng: dto.originLng },
        { lat: place.location.coordinates[1], lng: place.location.coordinates[0] },
      ),
    );
  }
  geocode(dto: GeocodeQueryDto) {
    return this.map.geocode(dto.q);
  }
  createCategory(dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }
  async createPlace(dto: CreatePlaceDto) {
    if (!(await this.categories.exists({ _id: dto.categoryId, active: true })))
      throw new BadRequestException('Invalid category');
    return this.places.create({ ...dto, location: { type: 'Point', coordinates: [dto.lng, dto.lat] } });
  }
  async updatePlace(id: string, dto: Partial<UpdatePlaceDto>) {
    const update: any = { ...dto };
    if (dto.lat !== undefined && dto.lng !== undefined)
      update.location = { type: 'Point', coordinates: [dto.lng, dto.lat] };
    delete update.lat;
    delete update.lng;
    const place = await this.places.findByIdAndUpdate(id, update, { new: true });
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }
  async hideReview(id: string) {
    const review = await this.reviews.findByIdAndUpdate(id, { visible: false }, { new: true });
    if (!review) throw new NotFoundException('Review not found');
    await this.refreshRating(review.placeId.toString());
    return review;
  }
}
