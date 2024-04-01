module.exports = app => {
    const createCrud = async (element, tableName) => {
        try {
            const createdRow = await app.db(tableName).insert(element)
            return createdRow
        } catch (error) { throw error }
    }

    const updateCrud = async (element, tableName) => {
        idColumnName = `${tableName}Id`;
        idUserColumnName = `${tableName}UserId`;

        try {
            const row = await app.db(tableName)
                .update(element)
                .where({ [idColumnName]: element[idColumnName] })
                .andWhere({ [idUserColumnName]: element[idUserColumnName] });
            return row;
        } catch (err) { throw err; }
    }

    const readCrudById = async (elementId, userId, tableName) => {
        idColumnName = `${tableName}Id`;
        idUserColumnName = `${tableName}UserId`;

        try {
            const row = await app.db(tableName)
                .where({ [idColumnName]: elementId })
                .andWhere({ [idUserColumnName]: userId })
                .first()
            return row
        } catch (err) { throw err }
    }

    const readCrudPaged = async (userId, tableName, pageOptions) => {
        try {
            idColumnName = `${tableName}Id`;
            idUserColumnName = `${tableName}UserId`;
            const page = pageOptions.page || 1

            const result = await app.db(tableName)
                .count(idColumnName)
                .where({ [idUserColumnName]: userId })
                .first()
            const count = parseInt(result.count)

            const selectRows = await app.db(tableName)
                .limit(pageOptions.limit)
                .where({ [idUserColumnName]: userId })
                .orderBy(idColumnName, 'asc')
                .offset(page * pageOptions.limit - pageOptions.limit)

            return { data: selectRows, count, limit: pageOptions }
        } catch (err) { throw err }
    }

    const readCrud = async (userId, tableName) => {
        try {
            idColumnName = `${tableName}Id`;
            idUserColumnName = `${tableName}UserId`;

            const rows = await app.db(tableName)
                .where({ [idUserColumnName]: userId })
                .orderBy(idColumnName, 'asc')
            return rows
        } catch (err) { throw err }
    }

    const deleteCrud = async (elementId, userId, tableName) => {
        try {
            idColumnName = `${tableName}Id`;
            idUserColumnName = `${tableName}UserId`;

            const rowsDeleted = await app.db(tableName)
                .where({ [idColumnName]: elementId })
                .andWhere({ [idUserColumnName]: userId })
                .del();
            return rowsDeleted
        } catch (err) { throw err }
    }
    return { createCrud, updateCrud, readCrud, readCrudById, readCrudPaged, deleteCrud }
}