import { Injectable, BadRequestException } from '@nestjs/common';
import { forbiddenWords } from '../config/forbidden-words';

@Injectable()
export class ContentFilterService {
  validateContent(content: string) {
    const foundWords = forbiddenWords.filter((word) => content.includes(word));
    if (foundWords.length > 0) {
      throw new BadRequestException(
        `The review contains one or more offensive words.`,
      );
    }
  }
}
