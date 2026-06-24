const authMiddleWare = (req, res, next) => {
    const token = "abc";
    if (token === "ab1c") {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

module.exports = {
    authMiddleWare
}