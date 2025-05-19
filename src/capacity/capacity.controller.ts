import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';

@Controller('capacity')
export class CapacityController {
  constructor(private readonly capacityService: CapacityService) {}

  @Post()
  create(@Body() createCapacityDto: CreateCapacityDto) {
    return this.capacityService.create(createCapacityDto);
  }

  @Get()
  findAll() {
    return this.capacityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capacityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCapacityDto: UpdateCapacityDto) {
    return this.capacityService.update(+id, updateCapacityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capacityService.remove(+id);
  }
}
