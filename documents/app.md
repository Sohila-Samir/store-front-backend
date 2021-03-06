# app additional info

## Table of contents:
- [dependencies](#dependencies)
- [dev-dependencies](#dev-dependencies)
- [scripts](#Scripts)


## dependencies:
    "@types/bcrypt": "^5.0.0",
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.2",
    "cors": "^2.8.5",
    "db-migrate": "^0.11.13",
    "db-migrate-pg": "^1.2.2",
    "dotenv": "^16.0.0",
    "express": "^4.17.3",
    "fs": "0.0.1-security",
    "jasmine": "^4.0.2",
    "pg": "^8.7.3",
    "supertest": "^6.2.2"
## dev-dependencies:
    "@types/body-parser": "^1.19.2",
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.13",
    "@types/jasmine": "^3.10.3",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/node": "^17.0.18",
    "@types/pg": "^8.6.4",
    "@types/prettier": "^2.4.4",
    "@types/supertest": "^2.0.11",
    "@typescript-eslint/eslint-plugin": "^5.12.0",
    "@typescript-eslint/parser": "^5.12.0",
    "eslint": "^8.9.0",
    "eslint-config-prettier": "^8.4.0",
    "eslint-plugin-prettier": "^4.0.0",
    "jasmine-spec-reporter": "^7.0.0",
    "jsonwebtoken": "^8.5.1",
    "nodemon": "^2.0.15",
    "prettier": "^2.5.1",
    "ts-node": "^10.5.0",
    "typescript": "^4.5.5"

## Scripts:
    "build": "npx tsc",
    "ts-watch": "npx tsc --watch",
    "lint": "eslint ./src/**/*.ts ./dist/**/*.js --fix",
    "jasmine": "jasmine ./dist/**/*.js",
    "Itest": "db-migrate --env test -c 4 down && set ENV=test && db-migrate --env test up && npm run jasmine && db-migrate --env test -c 4 down",
    "all": "npm run build && npm run lint && npm run Itest"