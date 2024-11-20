import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data: string[], ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const headers = req.rawHeaders;
        //console.log('data',headers)

        return (headers)

    }
)