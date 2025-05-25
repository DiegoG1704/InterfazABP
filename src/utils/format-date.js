export const formatearFechaISO = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-PE', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}