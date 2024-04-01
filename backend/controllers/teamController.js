module.exports = app => {
    const Team = app.models.team
    const Folder = app.models.folder

    const save = async (req, res) => {
        const team = req.body;
        team.teamsUserId = req.user.id;

        const numberOfPokemons = req.body.team.length
        let numberOfAlternativesPokemons;
        if (req.body.alternatives) numberOfAlternativesPokemons = req.body.alternatives.length
        if (numberOfPokemons > 6 || numberOfAlternativesPokemons > 4) {
            res.status(400).send(`Um time pode conter no máximo de 6 pokemons principais e 4 alternativos`);
        }
        else if ((numberOfPokemons <= 6 && numberOfPokemons >= 1) && (numberOfAlternativesPokemons <= 4)) {
            try {
                if (req.params.id) {
                    team.teamsId = req.params.id
                    const updatedTeam = await Team.updateTeam(team)
                    if (updatedTeam) {
                        res.sendStatus(200)
                    }
                    else {
                        res.sendStatus(401)
                    }
                } else {
                    if (!team.folderId) {
                        const defaultFolder = await Folder.getDefaultFolder(team.teamsUserId)
                        team.folderId = defaultFolder.foldersId
                    }
                    else {
                        const setedFolder = await Folder.getFolderById(team.folderId, team.teamsUserId)
                        if (!setedFolder) {
                            return res.status(404).send({ msg: 'Grupo não encontrado.' });
                        }
                    }
                    const createdTeam = await Team.createTeam(team)
                    res.status(201).send(createdTeam)
                }
            } catch (error) { res.status(500).send(error) }
        }
        else {
            res.status(400).send(`Você não pode ter um time vazio`);
        }
    }

    const get = async (req, res) => {
        try {
            const setedFolder = await Folder.getFolderById(req.params.id, req.user.id)
            if (!setedFolder) {
                res.status(404).send({ msg: 'Grupo não encontrado.' })
            }
            else {
                const selectedTeam = await Team.getByFolder(req.user.id, req.params.id, { limit: 20, page: req.query.page })
                res.json(selectedTeam)
            }
        } catch (msg) { return res.status(500).send({ erro: msg }) }
    }

    const getAll = async (req, res) => {
        try {
            const selectedTeams = await Team.getAllTeams(req.user.id, { limit: 20, page: req.query.page })
            if (selectedTeams) {
                res.json(selectedTeams)
            }
            else {
                res.sendStatus(404)
            }
        } catch (msg) { return res.status(500).send({ erro: msg }) }
    }

    const getById = async (req, res) => {
        try {
            const selectedTeam = await Team.getTeamById(req.user.id, req.params.id)
            if (selectedTeam) {
                res.json(selectedTeam)
            }
            else {
                res.sendStatus(401)
            }
        } catch (msg) { return res.status(500).send({ erro: msg }) }
    }

    const remove = async (req, res) => {
        try {
            const removedTeam = await Team.removeTeam(req.params.id, req.user.id)
            if (removedTeam) {
                res.json(removedTeam)
            }
            else {
                res.sendStatus(401)
            }
        } catch (error) {
            res.sendStatus(500)
        }
    }

    return { save, get, getAll, getById, remove }
}