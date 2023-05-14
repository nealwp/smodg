export const migrationTemplate = (input: {tableDefinition: string, columnDefinitions: string}) => {
    return `
import { DataType } from 'sequelize-typescript';
import type { Migration } from '../db';

const tableDefinition = {
${input.tableDefinition}
}

const columnDefinition = {
${input.columnDefinitions}
};

export const up: Migration = async ({ context: queryInterface }) => {
    await queryInterface.createTable(tableDefinition, columnDefinition);
};

    `
}
