export const migrationTemplate = (input: {tableDefinition: string, columnDefinitions: string}) => {
    return `
import { DataType } from 'sequelize-typescript';
import type { Migration } from '../db';

const tableDefinition = {
${input.tableDefinition}
}

const columnDefinition = {
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
};

export const up: Migration = async ({ context: queryInterface }) => {
    await queryInterface.createTable(tableDefinition, columnDefinition);
};

`
}
