module.exports = app => {
    const { getStat } = app.models.stat

    const get = async (req, res) => {
        try {
            const selectedStat = await getStat(req.user.id)
            if (selectedStat) {
                res.send(selectedStat)
            }
            else { res.sendStatus(404) }
        } catch (error) {
            req.senndStatus(500)
        }
    }

    return { get }
}