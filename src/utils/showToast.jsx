export const showToast = (tipo, titulo, detalle, toast) => {
    toast.current.show({
        severity: tipo,
        summary: titulo,
        detail: detalle,
        life: 3000,
    });
};

export const showToastWithErrors = (tipo, titulo, errores, toast) => {
    const listError = generarMensajesError(errores)
    
    showToast(tipo, titulo, listError, toast)
}
export const generarMensajesError = (errores) => {
    return errores?.map((error, index) => (
        <p key={index}>- {error?.message}</p>
    ));
};