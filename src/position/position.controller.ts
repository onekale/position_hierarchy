import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PositionService } from './position.service';
import { Position } from './position.entity';
import { CreatePositionDto } from './create-position.dto';

//define various HTTP requests to perform CRUD operations o the 'position' entity
@Controller('path')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionService.create(createPositionDto);
  }

  @Get('/hierarchy')
  findAllHierarchy(): Promise<Position[]> {
    return this.positionService.findAllHierarchy();
  }

  @Get()
  findAll(): Promise<Position[]> {
    return this.positionService.findAll();
  }
  @Get('/root')
  findRoot(): Promise<Position[]>{
    return this.positionService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: number): Promise<Position> {
    return this.positionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatePositionDto: any): Promise<Position> {
    return this.positionService.update(id, updatePositionDto);
  }

  // @Get(':childId/root')
  // async findRootFromChild(
  //   @Param('childId', ParseIntPipe) childId: number,
  // ): Promise<Position> {
  //   return this.positionService.findRootFromChild(childId);
  // }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.positionService.remove(id);
  }




}
