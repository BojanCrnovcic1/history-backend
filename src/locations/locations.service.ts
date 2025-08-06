import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Locations } from '../entities/locations.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/misc/api.response.class';
import { CreateLocationDto } from './dto/create.location.dto';
import { UpdateLocationDto } from './dto/update.location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Locations)
    private readonly locationRepository: Repository<Locations>,
  ) {}

  async getLocationsWithEventsGeoJSON(): Promise<Locations | ApiResponse> {
    const locations = await this.locationRepository.find({
      relations: ['events'],
    });
    if (!locations) {
        return new ApiResponse('error', -5001, 'Locations not found!')
    }

    const features = locations.map((loc) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(loc.longitude),
          parseFloat(loc.latitude),
        ],
      },
      properties: {
        locationId: loc.locationId,
        name: loc.name,
        events: loc.events.map((event) => ({
          eventId: event.eventId,
          title: event.title,
          year: event.year,
          isPremium: event.isPremium,
        })),
      },
    }));

    const geoJson = {
      type: 'FeatureCollection',
      features,
    };

    return new ApiResponse(
      'success',
      200,
      'GeoJSON data successfully fetched',
      geoJson,
    );
  }

  async createLocation(dto: CreateLocationDto): Promise<Locations | ApiResponse> {
    const location = this.locationRepository.create(dto);
    await this.locationRepository.save(location);
    return new ApiResponse(
      'success',
      201,
      'Location successfully created',
      location,
    );
  }

  async updateLocation(locationId: number, dto: UpdateLocationDto): Promise<ApiResponse> {
    const location = await this.locationRepository.findOne({ where: { locationId: locationId } });

    if (!location) {
        return new ApiResponse('error', -5001, 'Locations not found!')
    }

    const updated = Object.assign(location, dto);
    await this.locationRepository.save(updated);

    return new ApiResponse(
      'success',
      200,
      'Location successfully updated',
      updated,
    );
  }

  async deleteLocation(locationId: number): Promise<ApiResponse> {
    const location = await this.locationRepository.findOne({ 
        where: {locationId: locationId},
     });
    if (!location) {
        return new ApiResponse('error', -5001, 'Locations not found!')
    }
  
    await this.locationRepository.remove(location);
    return new ApiResponse('success', 200, 'Location deleted successfully');
  }
  
}
