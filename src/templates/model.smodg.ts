export const modelTemplate = (input: any) => {
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

import { <%MODEL_NAME%> as <%MODEL_NAME%>API } from  '@edf-re/gsp-service-interfaces/gsp-opex-service'
import { ModelAttributeColumnOptions } from 'sequelize';

interface <%MODEL_NAME%>Attributes extends <%MODEL_NAME%>API {
    id: number;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}

type <%MODEL_NAME%>Keys = keyof <%MODEL_NAME%>Attributes

interface ColumnOptions extends ModelAttributeColumnOptions {
    field: string
}

export const tableDefinition = {
    tableName: '<%TABLE_NAME%>',
    schema: '<%SCHEMA_NAME%>',
}

export const columnDefinition: Record<<%MODEL_NAME%>Keys, ColumnOptions> = {
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
export class <%MODEL_NAME%> extends Model<<%MODEL_NAME%>Attributes> implements <%MODEL_NAME%>Attributes {
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