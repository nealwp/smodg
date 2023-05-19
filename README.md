# smodg - Sequelize Model Generator 
> Generate Sequelize models from TypeScript type definitions

[![npm version](https://badgen.net/npm/v/smodg)](https://www.npmjs.com/package/smodg)
![tests](https://github.com/nealwp/smodg/actions/workflows/test.yml/badge.svg)
![build](https://github.com/nealwp/smodg/actions/workflows/build.yml/badge.svg)

## Installation

```bash
npm install -g smodg@latest
```
or
```bash
npx smodg@latest 
```
## Usage

```
Usage:

    smodg [options] <filepath> 

Options:

    --help, -h                   show help
    --migration                  create an Umzug migration. default: false
    --outputDir=PATH, -o PATH    model output directory, relative to current path. default: "src/models"         
    --schema=NAME, -s NAME       specify a schema. default is no schema 
    --version, -v                print installed version
```

## Examples:
Create a model in `src/models`:
```bash
smodg ./my-type-file.ts
```

Create a model with a specific schema name:
```bash
smodg --schema=my_schema ./my-type-file.ts
```

Create a model and include a CREATE TABLE migration in `./src/migrations`:
```bash
smodg --migration ./my-type-file.ts
```

Create a model with a custom output path:
```bash
# do not prefix output dir with ./
smodg --outputDir=src/db-schema ./my-type-file.ts
```
## Features
* Generates boilerplate Sequelize model in `./src/models/` that includes:
    * imports from `sequelize-typescript` and `sequelize`
    * `Attributes` and `ColumnOptions` interfaces
    * table definition object with table name
    * column definition object with column names and datatypes
    * model definition with `@Table` and `@Column` decorators

## Limitations
* Currently only works with one type per file. Multiple type aliases in one file will not work.
* Defaults properties of type `number` to `Sequelize.FLOAT`. All generated numeric column definitons need to be reviewed for accuracy.
* Foreign keys and constraints must be added manually
* `interface` is not supported yet

## Example Output

```typescript
// my-custom-type.ts
export type UserAccount = {
    name: string,
    userName: string,
    birthday: Date,
    age: number,
    isActive: boolean
}
```

```bash
# terminal command
smodg --schema=applicationAccess --migration ./my-custom-type.ts
```

The above command will generate two files:

```typescript
// src/models/user-account.model.ts
import {
    Column,
    Table,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    HasMany,
} from 'sequelize-typescript';

import { UserAccount as UserAccountType } from '@_YOUR_TYPES'
import { ModelAttributeColumnOptions } from 'sequelize';

interface UserAccountCreationAttributes extends UserAccountType {}

interface UserAccountAttributes extends UserAccountCreationAttributes {
    id: number;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}

type UserAccountKeys = keyof UserAccountAttributes

interface ColumnOptions extends ModelAttributeColumnOptions {
    field: string
}

export const tableDefinition = {
    tableName: 'user_account',
    schema: 'application_access',
}

export const columnDefinition: Record<UserAccountKeys, ColumnOptions> = {
    id: {
        field: "id",
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        field: 'name',
        type: DataType.STRING
    },
    userName: {
        field: 'user_name',
        type: DataType.STRING
    },
    birthday: {
        field: 'birthday',
        type: DataType.DATE
    },
    age: {
        field: 'age',
        type: DataType.FLOAT
    },
    isActive: {
        field: 'is_active',
        type: DataType.BOOLEAN
    },
    createdBy: {
        field: "created_by",
        type: DataType.STRING,
    },
    createdDate: {
        field: "created_date",
        type: DataType.DATE,
    },
    updatedBy: {
        field: "updated_by",
        type: DataType.STRING,
    },
    updatedDate: {
        field: "updated_date",
        type: DataType.DATE,
    },
}

@Table(tableDefinition)
export class UserAccount
extends Model<UserAccountAttributes, UserAccountCreationAttributes>
implements UserAccountAttributes {
    @Column(columnDefinition.id)
    id!: number;

    @Column(columnDefinition.name)
    name!: string

    @Column(columnDefinition.userName)
    userName!: string

    @Column(columnDefinition.birthday)
    birthday!: Date

    @Column(columnDefinition.age)
    age!: number

    @Column(columnDefinition.isActive)
    isActive!: boolean

    @Column(columnDefinition.createdBy)
    createdBy!: string;

    @CreatedAt
    @Column(columnDefinition.createdDate)
    createdDate!: Date;

    @Column(columnDefinition.updatedBy)
    updatedBy!: string;

    @UpdatedAt
    @Column(columnDefinition.updatedDate)
    updatedDate!: Date;
}
```

```typescript
// src/migrations/2023.05.18T18.13.57-Create-Table-UserAccount.ts
import { DataType } from 'sequelize-typescript';
import type { Migration } from '../db';

const tableDefinition = {
    tableName: 'user_account',
    schema: 'application_access',
}

const columnDefinition = {
    id: {
        field: "id",
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        field: 'name',
        type: DataType.STRING
    },
    userName: {
        field: 'user_name',
        type: DataType.STRING
    },
    birthday: {
        field: 'birthday',
        type: DataType.DATE
    },
    age: {
        field: 'age',
        type: DataType.FLOAT
    },
    isActive: {
        field: 'is_active',
        type: DataType.BOOLEAN
    },
    createdBy: {
        field: "created_by",
        type: DataType.STRING,
    },
    createdDate: {
        field: "created_date",
        type: DataType.DATE,
    },
    updatedBy: {
        field: "updated_by",
        type: DataType.STRING,
    },
    updatedDate: {
        field: "updated_date",
        type: DataType.DATE,
    },
};

export const up: Migration = async ({ context: queryInterface }) => {
    await queryInterface.createTable(tableDefinition, columnDefinition);
};
```