 import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Position } from './position.entity';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}


  async findAllHierarchy(): Promise<Position[]> {
    // Fetch all positions from the database
    const positions = await this.positionRepository.find();
  
    // Initialize the hierarchy by adding a children array to each position
    positions.forEach(position => {
      position.children = [];
    });
  
    // Recursive function to build the hierarchy
    const buildHierarchy = (position: Position): Position => {
      // Find all children of the current position
      const children = positions.filter(p => p.parentId === position.id);
      // Recursively build the hierarchy for each child
      children.forEach(child => {
        const childNode = buildHierarchy(child);
        position.children.push(childNode);
        
      });
      // Return the current position with its hierarchy
      return position;
    };
  
    // Find root positions (positions with no parent)
    const roots: Position[] = positions.filter(position => !position.parentId);
  
    // Build and return the tree structure starting from the roots
    return roots.map(root => buildHierarchy(root));
  }
  

  create(createPositionDto: any): Promise<Position> {
    const position = new Position();
    position.name = createPositionDto.name;
    position.description = createPositionDto.description;
    position.parent = createPositionDto.parentId ? { id: createPositionDto.parentId } as Position : null;
    return this.positionRepository.save(position);
  }

  findAll(): Promise<Position[]> {
    return this.positionRepository.find({ relations: ['children', 'parent'] });
  }
 

  findOne(id: number): Promise<Position> {
    const options: FindOneOptions<Position> = { where: { id }, relations: ['children', 'parent'] };
    return this.positionRepository.findOne(options);
    // return this.positionRepository.findOne(id);
  }

  async findRoot(): Promise<Position[]>{
    // const positions = await this.positionRepository.find({ relations: ['children', 'parent'] });
    // const Position = positions.filter(position => !position.parent).join(",")
    // console.log(Position);
    return this.positionRepository.find({  where: { parent : null} })
  }

  async update(id: number, updatePositionDto: any): Promise<Position> {
    const position = await this.findOne(id);
    position.name = updatePositionDto.name || position.name;
    position.description = updatePositionDto.description || position.description;
    position.parent = updatePositionDto.parentId ? { id: updatePositionDto.parentId } as Position : position.parent;
    return this.positionRepository.save(position);
  }

  async remove(id: number): Promise<void> {
    await this.positionRepository.delete(id);
  }

  // async findRootFromChild(childId: number): Promise<Position> {
  //   // Fetch all positions with their parent relations
  //   const positions = await this.positionRepository.find({ relations: ['parent'] });
  //   const positionMap = new Map<number, Position>();
    
  //   // Initialize the map with positions
  //   positions.forEach(position => {
  //     positionMap.set(position.id, position);
  //   });
  
  //   // Recursive function to find the root from a given position
  //   const findRoot = (position: Position): Position => {
  //     // If the position has no parent, it is a root
  //     if (!position.parent) {
  //       return position;
  //     }
  //     // Recursively find the parent until the root is found
  //     const parentPosition = positionMap.get(position.parent.id);
  //     return findRoot(parentPosition);
  //   };
  
  //   // Find the starting child position
  //   const childPosition = positionMap.get(childId);
  //   if (!childPosition) {
  //     throw new NotFoundException(`Position with ID ${childId} not found`);
  //   }
  
  //   // Find and return the root from the child position
  //   return findRoot(childPosition);
  // }
  


}
