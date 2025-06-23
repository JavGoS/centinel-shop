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
  async sumByProducts(id: number) {
    const resultSum = await this.prismaService.producto.groupBy({
      by: ['tipo_producto_id'],
      _sum: {
        precio: true
      }
    });
    const tipos = await this.prismaService.tipoProducto.findMany({
      select: {
        tipo_producto_id: true,
        nombre: true
      }
    })
    return resultSum.map(r => ({
      tipo_producto_id: r.tipo_producto_id,
      tipo_nombre: tipos.find(t => t.tipo_producto_id === r.tipo_producto_id)?.nombre ?? null,
      cantidad_total: r._sum.precio,
    }));
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
