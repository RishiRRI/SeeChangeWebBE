import { Controller, Get } from '@nestjs/common';

@Controller('update')
export class UpdateController {
    @Get('update')
    getLatestApk(){
        return{
            version: '1.0.0',
            // apkUrl: 'https://app.rrispat.in/public/rr534.apk'
        }
    }
}

