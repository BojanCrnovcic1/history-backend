import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Locations } from 'src/entities/locations.entity';
import { CreateLocationDto } from './dto/create.location.dto';
import { ApiResponse } from 'src/misc/api.response.class';
import { UpdateLocationDto } from './dto/update.location.dto';

@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('geojson')
  async getLocationsGeoJSON() {
    return this.locationsService.getLocationsWithEventsGeoJSON();
  };

  @Post()
  async createLocation(
    @Body() createDto: CreateLocationDto,
  ): Promise<Locations | ApiResponse> {
    return this.locationsService.createLocation(createDto);
  }

  @Patch(':id')
  async updateLocation(
    @Param('id') locationId: number,
    @Body() updateDto: UpdateLocationDto,
  ): Promise<Locations | ApiResponse> {
    return this.locationsService.updateLocation(locationId, updateDto);
  };

  @Delete(':id')
  async deleteLocation(@Param('id') locationId: number): Promise<ApiResponse> {
      return await this.locationsService.deleteLocation(locationId);
  };

}
