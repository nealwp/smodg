# smodg - Sequelize Model Generator 
> Generate Sequelize models from TypeScript type definitions

## Installation

```bash
npm i -g @nealwp/smodg
```

## Usage
### `smodg <path>`
Example:
```bash
# from project root:

smodg ./src/types/my-type-file.type.ts
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
* Defaults properties of type `number` to `Sequelize.DECIMAL`. All generated numeric column definitons need to be reviewed for accuracy.
* If a schema is required, it must be added to the table definition object
* Foreign keys and constraints must be added manually
* `interface` is not supported yet
