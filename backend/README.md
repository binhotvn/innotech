# For Innotech Vietnam

This project is using NestJS, MongoDB, Redis (for cache), EventEmitter (redis also not MQ)

## To running this

Make sure you have Docker to running this, because I need redis and mongodb

1. Make sure installed nestjs/cli and Docker
```bash
npm i -g @nestjs/cli
```
2. Install all the package
```bash
yarn install 
```
3. Create .env file 
```bash
cp default.env .env
```
4. Run the Docker Compose to start MongoDB & Redis
```bash
cd example/
docker-compose up -d
```

5. Run this project
```bash
yarn start:debug
```

## Review 
So for this requirement I need to implement products module have:
- id (_id because of mongodb, auto-increase => uuid_v4)
- name
- description
- category (index for faster filter)
- price

beside that I also include `softDelete` for DELETE /products/:id. why? because in some projects `products` is foreign of `orders` or `stockEntry` or it's has so large CCU, delete something could led to bad things happen, mark it delete (soft-delete) is better then I using EventEmit to Delete it later

I have create 3 end-point:
- GET / -> List all of products, I also implement pagination and filter 
- POST / -> Create new products
- DELETE /:id -> Delete products

What I could do better
- `category` should be a separate module, so someone could update `name` or `description` of that category
- I should implement `product.strategies` to write business logic of products inside of this and check all `strategies` before create or update. Example: I could contain `price` should not be free, `name` must be the real-name, ... 
 
