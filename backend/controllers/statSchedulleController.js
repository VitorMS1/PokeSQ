const schedule = require('node-schedule');

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {

        const usersIds = await app.db('users').select('userId');

        for (const user of usersIds) {
            const teamsCount = await app.db('teams').where({ teamsUserId: user.userId }).count('teamsId').first()
            const favoritesCount = await app.db('favorites').where({ favoritesUserId: user.userId }).count('favoritesId').first()

            const { Stat } = app.models.stat
            let stat = null

            const statData = {
                teams: parseInt(teamsCount.count),
                favorites: parseInt(favoritesCount.count),
                userId: user.userId,
                createdAt: new Date()
            }

            const lastStat = await Stat.findOne({ userId: user.userId })
            if (!lastStat) {
                stat = new Stat(statData)
                save(stat)
            }
            else if (statData.teams !== lastStat.teams || statData.favorites !== lastStat.favorites) {
                lastStat.teams = statData.teams;
                lastStat.favorites = statData.favorites;
                lastStat.createdAt = statData.createdAt;
                save(lastStat)
            }
        }

        function save(element) {
            element.save()
                .catch(error => { console.error('Erro ao criar registro:', error); });
        }
    });
}