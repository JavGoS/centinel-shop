import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShopService {
      constructor(
        private readonly prismaService: PrismaService
    ) { }
  create(createShopDto: CreateShopDto) {
    return 'This action adds a new shop';
  }

  async findAll() {
    return await this.prismaService.producto.findMany();
    
  }
  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
