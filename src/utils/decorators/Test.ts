import { plainToClass } from "class-transformer"
import { transformAndValidateSync } from "class-transformer-validator"
import { IsString } from "class-validator"
class Test {
  @IsString()
  test: string

  exclude: string
}

const x = {
  test: "123",
  blabla: "123",
}

const b = plainToClass(Test, x, {
  strategy: "exposeAll",
  excludeExtraneousValues: true,
})

const a = transformAndValidateSync(Test, x)

console.log({
  a,
})
