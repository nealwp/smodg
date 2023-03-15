const generateModel = (fileContent: string) => {
    return "@Column({ field: 'name', type: Sequelize.STRING })\nname!: string"
}

export { generateModel }