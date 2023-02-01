import { IsEmail, IsString } from "class-validator"

export function IsEmailString(
  isStringOptions?: IsStringParameterType[0],
  isEmailOptions?: IsEmailParameterType[0]
) {
  return function (object: Object, propertyName: string) {
    IsString(isStringOptions)(object, propertyName)
    IsEmail(isEmailOptions)(object, propertyName)
  }
}

type IsStringParameterType = Parameters<typeof IsString>
type IsEmailParameterType = Parameters<typeof IsEmail>
