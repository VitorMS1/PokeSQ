module.exports = app => {
    const Folder = app.models.folder
    const Team = app.models.team
    const { existsOrError, notExistOrError } = app.controllers.validator

    const save = async (req, res) => {
        try {
            const folder = {
                name: req.body.name,
                parentId: req.body.parentId ? req.body.parentId : null,
                foldersUserId: req.user.id
            }
            if (req.params.id) folder.foldersId = req.params.id

            if (folder.parentId) {
                const verifyFolderParent = await Folder.getFolderById(folder.parentId, folder.foldersUserId)
                if (!verifyFolderParent) {
                    const defaultFolder = await Folder.getDefaultFolder(folder.foldersUserId)
                    existsOrError(defaultFolder, 'Não foi possível cadastrar o grupo')
                    folder.parentId = defaultFolder.foldersId
                }
                else if (folder.foldersId == folder.parentId) {
                    folder.parentId = verifyFolderParent.parentId
                }
                else if (verifyFolderParent.parentId && folder.foldersId) {
                    if (verifyFolderParent.parentId == folder.foldersId) {
                        const actualFolder = await Folder.getFolderById(folder.foldersId, folder.foldersUserId)
                        folder.parentId = actualFolder.parentId
                    }
                    else {
                        const getParent = (folders, parentId) => {
                            const parent = folders.filter(folder => folder.foldersId === parentId)
                            return parent.length ? parent[0] : null
                        }

                        const getParentsFolders = (folders, folderParent) => {
                            let parentsIds = []
                            let parent = getParent(folders, folderParent.parentId)
                            while (parent) {
                                parentsIds.push(parent)
                                parent = getParent(folders, parent.parentId)
                            }
                            return parentsIds
                        }

                        const selectedFolders = await Folder.getFolders(folder.foldersUserId)
                        const parentsFolders = getParentsFolders(selectedFolders, verifyFolderParent)
                        const isParent = parentsFolders.filter(node => node.foldersId == folder.foldersId)
                        if (isParent) {
                            const actualFolder = await Folder.getFolderById(folder.foldersId, folder.foldersUserId)
                            folder.parentId = actualFolder.parentId
                        }
                    }
                }
            }
            if (req.params.id) {
                folder.foldersId = req.params.id
                const updatedFolder = await Folder.updateFolder(folder)
                if (updatedFolder) {
                    res.sendStatus(200)
                }
                else {
                    res.sendStatus(404)
                }
            }
            else {
                const createdFolder = await Folder.createFolder(folder)
                if (createdFolder) {
                    res.sendStatus(201)
                }
                else {
                    res.sendStatus(404)
                }
            }
        } catch (error) { res.status(500).send(error) }
    }

    const getPath = folders => {
        const getParent = (folders, parentId) => {
            const parent = folders.filter(folder => folder.foldersId === parentId)
            return parent.length ? parent[0] : null
        }

        const foldersWithPath = folders.map(folder => {
            let path = folder.name
            let parent = getParent(folders, folder.parentId)
            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(folders, parent.parentId)
            }
            return { ...folder, path }
        })

        foldersWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            return 0
        })
        return foldersWithPath
    }

    const getWithPath = async (req, res) => {
        try {
            const selectedFolders = await Folder.getFolders(req.user.id)
            const selectedFoldersWithPath = getPath(selectedFolders)
            if (selectedFoldersWithPath) {
                res.json(selectedFoldersWithPath)
            } else {
                res.sendStatus(404)
            }
        } catch (error) { res.status(500).send(error) }
    }

    const toTree = async (folders, userId, tree) => {
        if (!tree) tree = folders.filter(folder => !folder.parentId)
        for (const parentNode of tree) {
            const team = await Team.getTeamsInFolder(userId, parentNode.foldersId)
            if (team) parentNode.teams = team
            const isChild = node => node.parentId == parentNode.foldersId
            parentNode.children = await toTree(folders, userId, folders.filter(isChild))
        }
        return tree
    }

    const getTree = async (req, res) => {
        try {
            const selectedFolders = await Folder.getFolders(req.user.id)
            const foldersTRee = await toTree(selectedFolders, req.user.id)
            if (foldersTRee) {
                res.json(foldersTRee)
            }
            else {
                res.sendStatus(404)
            }
        } catch (error) { res.status(500).send(error) }
    }

    const getChildren = async (foldersId, userId) => {
        const foldersList = await Folder.getFolders(userId)
        const childrens = foldersList.filter(folder => folder.parentId == foldersId)
        return childrens.length ? childrens : null;
    }

    const remove = async (req, res) => {
        try {
            const teams = await Team.getTeamsInFolder(req.user.id, req.params.id)
            notExistOrError(teams, "O grupo possui time(s) inserido(s)")

            const foldersChilren = await getChildren(req.params.id, req.user.id)
            notExistOrError(foldersChilren, "O grupo possui sub-grupos inseridos")

            const deletedFolders = await Folder.removeFolder(req.params.id, req.user.id)
            existsOrError(deletedFolders, "Não foi possível excluir o grupo")
            if (deletedFolders) res.send('Grupo excluído')
        }
        catch (msg) { res.status(400).send(msg) }
    }

    return { save, getWithPath, getTree, remove }
}
