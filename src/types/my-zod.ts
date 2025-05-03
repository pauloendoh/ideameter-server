import { z } from "zod"

// https://stackoverflow.com/a/77736146

export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false

type NonUndefined<T> = Exclude<T, undefined>

export type MyFullZod<T extends object> = {
  [Key in keyof T]-?: Equals<T[Key], NonUndefined<T[Key]>> extends false
    ?
        | z.ZodOptional<z.ZodType<NonNullable<T[Key]>>>
        | z.ZodPipeline<z.ZodOptional<z.ZodType<any>>, z.ZodType<T[Key]>>
    : z.ZodType<T[Key]> | z.ZodPipeline<z.ZodType<any>, z.ZodType<T[Key]>>
}

export type MyPartialZod<T extends object> = Partial<MyFullZod<T>>

export type MyUnsafeZod<T extends object> = {
  // only get the key names, not the types
  [Key in keyof T]-?: z.ZodType<any>
}

export type MyUnsafePartialZod<T extends object> = Partial<MyUnsafeZod<T>>

// example usage
type Something = {
  name: string
  age: number
}

const myFullSchema = z.object({
  name: z.string(),
  age: z.number(),
} satisfies MyFullZod<Something>)

const myPartialSchema = z.object({
  name: z.string(),
} satisfies MyPartialZod<Something>)

const myUnsafeSchema = z.object({
  name: z.number(),
  age: z.string(),
} satisfies MyUnsafeZod<Something>)

const myUnsafePartialSchema = z.object({
  name: z.number(),
} satisfies MyUnsafePartialZod<Something>)

type MySchema = z.infer<typeof myFullSchema>

type MyPartialSchema = z.infer<typeof myPartialSchema>

type MyUnsafeSchema = z.infer<typeof myUnsafeSchema>

type MyUnsafePartialSchema = z.infer<typeof myUnsafePartialSchema>

export function isFromSchema<T>(
  data: unknown,
  schema: z.ZodType<T>
): data is T {
  try {
    schema.parse(data) // this doesn't mutate the data; the mutate date is the return value

    return true
  } catch {
    return false
  }
}
