
export type ModelTemplateInput = {
    modelName: string,
    tableDefinition: string,
    columnDefinitions: string,
    columnDecorators: string
}

export const modelTemplate = (input: ModelTemplateInput) => {
    return `
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

import { ${input.modelName} as ${input.modelName}Type } from '@_YOUR_TYPES'
import { ModelAttributeColumnOptions } from 'sequelize';

interface ${input.modelName}CreationAttributes extends ${input.modelName}Type {}

interface ${input.modelName}Attributes extends ${input.modelName}CreationAttributes {
    id: number;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}

type ${input.modelName}Keys = keyof ${input.modelName}Attributes

interface ColumnOptions extends ModelAttributeColumnOptions {
    field: string
}

export const tableDefinition = {
${input.tableDefinition}
}

export const columnDefinition: Record<${input.modelName}Keys, ColumnOptions> = {
    id: {
        field: "id",
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },   
${input.columnDefinitions}
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
export class ${input.modelName} 
extends Model<${input.modelName}Attributes, ${input.modelName}CreationAttributes>
implements ${input.modelName}Attributes {
    @Column(columnDefinition.id)
    id!: number;
${input.columnDecorators}
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
    `
}
