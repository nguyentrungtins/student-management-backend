import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('subject')
export class SubjectController {

    @UseGuards(AuthGuard('jwt'))
    @Post('/add')
    addSubject() {
        return 'add subject'
    }

}
