module.exports = (app) => {
    app.use(function (req, res, next) {
        if (req.ip !== '1') {
            res.status(202)
            return res.json({ ERROR: 'Permission denied' })
        }
        next()
    })
}