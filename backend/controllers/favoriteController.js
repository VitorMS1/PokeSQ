module.exports = app => {
    const Favorite = app.models.favorite
    const { existsOrError } = app.controllers.validator

    const save = async (req, res) => {
        try {
            const favorite = req.body;
            favorite.favoritesUserId = req.user.id
            existsOrError(favorite.pokemonId, 'informe o pokemon')
            const samePokemon = await Favorite.getFavoritesById(favorite.pokemonId, favorite.favoritesUserId)
            if (samePokemon) {
                return res.status(406).send('Pokemon já favoritado')
            }
            else {
                const createdFavorite = await Favorite.saveFavorite(favorite)
                if (createdFavorite) {
                    res.status(201).send('Pokemon favoritado')
                }
                else {
                    res.sendStatus(405)
                }
            }

        } catch (msg) { return res.status(500).send({ erro: msg }) }
    }

    const get = async (req, res) => {
        try {
            const selectedFavorites = await Favorite.getFavorites(req.user.id, { limit: 20, page: req.query.page })
            if (selectedFavorites) {
                res.json(selectedFavorites)
            }
            else {
                res.sendStatus(404)
            }
        } catch (msg) { return res.status(500).send({ erro: msg }) }
    }

    const remove = async (req, res) => {
        try {
            const removedFavorite = await Favorite.removeFavorite(req.body.pokemonId, req.user.id)
            if (removedFavorite) {
                res.json(removedFavorite)
            }
            else {
                res.sendStatus(404)
            }
        } catch (msg) { return res.status(500).send({ erro: msg }) }
    }


    return { save, get, remove }
}