# Mini Market API / Database Setup

Este README te guiará para levantar tu base de datos PostgreSQL en Docker, generar el cliente Prisma y poblar las tablas de un mini market con ejemplos de datos.

---

## 1. Levantar PostgreSQL en Docker

Ejecuta el siguiente comando para crear y correr un contenedor con tu base de datos:

```bash
docker run --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=tienda \
  -p 5433:5432 \
  -d postgres
```

- **Nombre del contenedor:** `postgres-dev`
- **Usuario / Password:** `postgres` / `admin`
- **Base de datos inicial:** `tienda`
- **Puerto expuesto:** `5432`

## 1.1. Abrir en CMD
--- 
```bash
docker exec -it postgres-dev psql -U postgres
```
## 2. Configurar Prisma

1. En la raíz de tu proyecto, crea (o edita) el archivo `.env` con la ruta a tu base de datos:

   ```env
   DATABASE_URL="postgresql://postgres:admin@localhost:5432/tienda?schema=public"
   ```

2. Define tu esquema en `src/prisma/schema.prisma`. Debería incluir los modelos:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model TipoProducto {
     tipo_producto_id Int        @id @default(autoincrement())
     nombre           String
     productos        Producto[]
     @@map("tipo_producto")
   }

   model Producto {
     producto_id      Int               @id @default(autoincrement())
     nombre           String
     precio           Int
     cantidad         Int
     tipo_producto_id Int
     tipoProducto     TipoProducto      @relation(fields: [tipo_producto_id], references: [tipo_producto_id])
     pedidos          ProductoPedido[]
     @@map("producto")
   }

   model Pedido {
     pedido_id     Int               @id @default(autoincrement())
     total         Int?
     fecha_pedido  DateTime          @default(now())
     productos     ProductoPedido[]
     @@map("pedido")
   }

   model ProductoPedido {
     pedido_id   Int
     producto_id Int
     cantidad    Int
     pedido      Pedido   @relation(fields: [pedido_id], references: [pedido_id])
     producto    Producto @relation(fields: [producto_id], references: [producto_id])
     @@id([pedido_id, producto_id])
     @@map("producto_pedido")
   }
   ```

3. Genera el cliente de Prisma:

   ```bash
   npx prisma generate --schema=src/prisma/schema.prisma
   ```

---

## 3. Definir Tablas y Poblar Datos

Entra a tu base de datos (por ejemplo con `psql` dentro del contenedor) y ejecuta este script SQL:

```sql
-- Tablas
CREATE TABLE tipo_producto (
    tipo_producto_id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL
);

CREATE TABLE producto (
    producto_id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio INT NOT NULL,
    cantidad INT NOT NULL,
    tipo_producto_id INT NOT NULL REFERENCES tipo_producto(tipo_producto_id)
);

CREATE TABLE pedido (
    pedido_id SERIAL PRIMARY KEY,
    total INT NULL,
    fecha_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE producto_pedido (
    pedido_id INT NOT NULL REFERENCES pedido(pedido_id),
    producto_id INT NOT NULL REFERENCES producto(producto_id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    PRIMARY KEY (pedido_id, producto_id)
);

-- Inserción de datos de ejemplo (mini market)
INSERT INTO tipo_producto (nombre) VALUES
  ('Lácteos'),
  ('Panadería'),
  ('Bebidas'),
  ('Aseo Personal'),
  ('Limpieza'),
  ('Frutas y Verduras'),
  ('Almacén');

INSERT INTO producto (nombre, tipo_producto_id, precio, cantidad) VALUES
  ('Leche Entera 1L',           1, 950,  50),
  ('Yogur Natural 125g',        1, 550,  80),
  ('Queso Chanco 200g',         1, 1800, 40),
  ('Pan de Molde Integral',     2, 1200, 30),
  ('Pan Baguette',              2,  800, 25),
  ('Agua Mineral 500 mL',       3,  700,100),
  ('Refresco Cola 330 mL',      3, 1000, 60),
  ('Jugo de Manzana 1L',        3, 1500, 45),
  ('Jabón de Manos 250 mL',     4,  900, 70),
  ('Champú 400 mL',             4, 2500, 35),
  ('Detergente Ropa 1 kg',      5, 3200, 20),
  ('Limpiador Multiuso 500 mL', 5, 1800, 30),
  ('Manzana Roja (kg)',         6, 2200, 25),
  ('Banano (kg)',               6, 1500, 40),
  ('Tomate (kg)',               6, 1800, 30),
  ('Arroz Blanco 1 kg',         7, 2000, 60),
  ('Fideo Espagueti 500 g',     7, 1300, 50);
```

---

## 4. Uso en tu Proyecto

- Importa el cliente Prisma:

  ```ts
  import { PrismaClient } from '@prisma/client';
  const prisma = new PrismaClient();
  ```

- Ejemplo de consulta:

  ```ts
  // Obtener todos los productos con su tipo
  const productos = await prisma.producto.findMany({
    include: { tipoProducto: true }
  });
  console.log(productos);
  ```

---

¡Con esto ya tienes tu entorno listo para trabajar con PostgreSQL, Docker y Prisma en tu mini market! 🎉

