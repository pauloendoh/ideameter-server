import { IsEmailString } from "../../../utils/decorators/IsStringEmail"
import usernameRegex from "../../../utils/regexes/usernameRegex"

export default interface RegisterDto {
  email: string
  username: string
  password1: string
  password2: string
}

export class RegisterPostDto {
  @IsEmailString({
    message: "Email must contain a valid email address",
  })
  email: string
}

export const getInvalidRegisterPayloadMessage = (data: RegisterDto) => {
  if (!data.email.length) return "Email is required"
  if (!data.username.length) return "Username is required"
  if (!data.password1.length) return "Password is required"
  if (data.password1.length < 6) return "Password must be at least 6 characters"
  if (data.password1 !== data.password2) return "Passwords don't match"

  if (!usernameRegex.test(data.username))
    return "Invalid characters for username. Only use letters and numbers."

  return ""
}
