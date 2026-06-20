import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
type Coordinates = { lat: number; lng: number };
@Injectable()
export class MapVinaService {
  constructor(private readonly config: ConfigService) {}
  private ensureConfigured() {
    if (!this.config.get('MAPVINA_BASE_URL') || !this.config.get('MAPVINA_API_KEY'))
      throw new ServiceUnavailableException('Map provider is not configured');
  }
  async geocode(query: string) {
    this.ensureConfigured();
    // Endpoint mapping is intentionally centralized until MapVina documentation is supplied.
    return { provider: 'mapvina', query, results: [] };
  }
  async route(origin: Coordinates, destination: Coordinates) {
    this.ensureConfigured();
    return { provider: 'mapvina', origin, destination, routes: [] };
  }
}
