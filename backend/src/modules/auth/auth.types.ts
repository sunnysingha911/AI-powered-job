import { z } from "zod"

/**
 * Authentication Request/Response Types
 */

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().optional(),
  }),
})

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
})

export type RegisterInput = z.infer<typeof RegisterSchema>["body"]
export type LoginInput = z.infer<typeof LoginSchema>["body"]

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
  token: string
}
