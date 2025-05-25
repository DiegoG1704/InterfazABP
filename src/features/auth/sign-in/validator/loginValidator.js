import { z } from 'zod';

export const loginSchema = z.object({
    usuario: z.string().min(3),
    contraseña: z.string().min(3),
});