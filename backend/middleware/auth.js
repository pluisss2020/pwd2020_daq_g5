const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token'); // Obtiene el header que contiene el token de autenticacion
        if (!token)
            return res.status(401).json({ msg: 'No authentication token, access denied.'});
            // El response 401 significa que la ruta donde se quiere acceder no esta autorizada para el cliente actual.   

        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verifica si el token del header funciona con el JWT_SECRET
        if (!verified)
            return res.status(401).json({ msg: 'Token verification failed, access denied.'})

        // Envia un valor mediante el req, luego en el archivo de rutas recibe el req y lo utiliza 
        req.user = verified.id;
        next(); // El next() otorga el control a la siguiente ruta coincidiente
    } catch (error) {
        res.status(500).json({ msg: error.message });        
    }
    
};

module.exports = auth;