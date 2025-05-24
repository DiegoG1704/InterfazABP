import { formatearFechaISO } from "../../../utils/format-date";

export const mapDebtData = (data) => {
    return data.map((item) => ({
    ...item,
    fechaVenc:formatearFechaISO (item.fechaVenc),
    }));
}