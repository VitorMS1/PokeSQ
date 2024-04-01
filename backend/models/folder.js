module.exports = app => {
    const { createCrud, updateCrud, readCrudById, readCrud, deleteCrud } = app.models.crud

    class Folder {
        constructor(foldersId, name, foldersUserId, parentId) {
            this.foldersId = foldersId;
            this.name = name;
            this.foldersUserId = foldersUserId;
            this.parentId = parentId;
        }

        static getDefaultFolder = async (userId) => {
            try {
                const selectedFolder = await app.db('folders')
                    .where({ foldersUserId: userId })
                    .orderBy('foldersId', 'asc')
                    .first()
                return selectedFolder
            } catch (error) { throw error }
        }

        static getFolderById = async (folderId, userId) => {
            try {
                const selectedFolder = await readCrudById(folderId, userId, "folders")
                return selectedFolder
            } catch (error) { throw error }
        }

        static getFolders = async (userId) => {
            try {
                const selectedFolders = await readCrud(userId, 'folders')
                return selectedFolders
            } catch (error) { throw error }
        }


        static createFolder = async (folder) => {
            try {
                const createdFolder = await createCrud(folder, "folders")
                return createdFolder
            } catch (error) { throw error }
        }

        static updateFolder = async (folder) => {
            try {
                const updatedFolder = await updateCrud(folder, "folders")
                return updatedFolder
            } catch (error) { throw error }
        }

        static removeFolder = async (folderId, userId) => {
            try {
                const deletedFolder = await deleteCrud(folderId, userId, "folders")
                return deletedFolder
            } catch (error) { throw error }
        }
    }

    return Folder
}