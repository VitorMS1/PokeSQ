const folder = require("./folder")

const querires = {
    folderWithChildren: ` 
        WITH RECURSIVE subfolders (id) AS (
            SELECT "foldersId" 
            FROM folders 
            WHERE "foldersId" = ?
            UNION ALL
            SELECT f."foldersId" 
            FROM subfolders, folders f
            WHERE "parentId" = subfolders.id
        )
        SELECT id FROM subfolders `}

module.exports = app => {
    const { createCrud, updateCrud, readCrudById, readCrudPaged, deleteCrud } = app.models.crud

    class Team {
        constructor() {

        }

        static createTeam = async (team) => {
            try {
                await createCrud(team, 'teams')
            } catch (error) { throw error }
        }

        static updateTeam = async (team) => {
            try {
                const updatedTeam = await updateCrud(team, 'teams')
                return updatedTeam
            } catch (error) { throw error }
        }

        static getByFolder = async (userId, folderId, pageOptions) => {
            try {
                const page = pageOptions.page || 1
                const folders = await app.db.raw(querires.folderWithChildren, folderId)
                const ids = folders.rows.map(folder => folder.id)
                const teamsSelectd = await app.db('teams')
                    .limit(pageOptions.limit)
                    .offset(page * pageOptions.limit - pageOptions.limit)
                    .whereIn('folderId', ids)
                    .andWhere({ teamsUserId: userId })
                    .orderBy('teamsId', 'asc')
                return teamsSelectd
            } catch (error) { throw error }
        }

        static getAllTeams = async (userId, pageOptions) => {
            try {
                const selectedTeams = await readCrudPaged(userId, "teams", pageOptions)
                return selectedTeams;
            } catch (error) { throw error }
        }

        static getTeamById = async (userId, teamId) => {
            try {
                const selectedTeam = await readCrudById(teamId, userId, "teams")
                return selectedTeam
            } catch (error) { throw error }
        }

        static removeTeam = async (teamId, userId) => {
            try {
                const removedTeam = deleteCrud(teamId, userId, "teams");
                return removedTeam
            } catch (error) { throw error }
        }

        static getTeamsInFolder = async (userId, folderId) => {
            try {
                const selectedTeam = await app.db('teams')
                    .where({ teamsUserId: userId })
                    .andWhere({ folderId: folderId })
                    .first()
                return selectedTeam
            } catch (error) { throw error }
        }
    }

    return Team
}