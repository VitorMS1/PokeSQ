module.exports = app => {
    const { createCrud, readCrudPaged } = app.models.crud

    class Favorite {
        constructor(id, pokemonoId, userId) {
            this.favoritesId = id;
            this.pokemonId = pokemonoId;
            this.favoritesUserId = userId;
        }

        static saveFavorite = async (favorite) => {
            try {
                const createdFavorite = await createCrud(favorite, "favorites")
                return createdFavorite
            } catch (error) { throw error }

        }
        static getFavorites = async (userId, pageOptions) => {
            try {
                const selectedFavorites = await readCrudPaged(userId, "favorites", pageOptions)
                return selectedFavorites
            } catch (error) { throw error }
        }

        static getFavoritesById = async (pokemonId, userId) => {
            try {
                const selectedFavorite = await app.db('favorites')
                    .where({ pokemonId })
                    .andWhere({ favoritesUserId: userId })
                    .first()
                return selectedFavorite
            } catch (error) { throw error }
        }

        static removeFavorite = async (pokemonId, userId) => {
            try {
                const rowsDeleted = await app.db('favorites')
                    .where({ pokemonId })
                    .andWhere({ favoritesUserId: userId })
                    .del();
                return rowsDeleted
            } catch (err) { throw err }
        }
    }

    return Favorite;
}
