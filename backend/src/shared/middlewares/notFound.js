// Si ninguna ruta respondió, la URL no existe
export const notFound = (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
};
