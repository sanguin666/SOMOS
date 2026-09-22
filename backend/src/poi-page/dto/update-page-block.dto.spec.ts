import { plainToInstance } from 'class-transformer';
import { UpdatePageBlockDto } from './update-page-block.dto.js';

// A cleared form field arrives as "", and an empty string stored in a
// nullable column crashes the app's renderer ("Unexpected text node").
describe('UpdatePageBlockDto', () => {
  it('turns a blank field into null', () => {
    const dto = plainToInstance(UpdatePageBlockDto, { title: '', body: '   ' });
    expect(dto.title).toBeNull();
    expect(dto.body).toBeNull();
  });

  it('trims but keeps a field that has text in it', () => {
    const dto = plainToInstance(UpdatePageBlockDto, { title: '  Welcome  ' });
    expect(dto.title).toBe('Welcome');
  });

  it('leaves an absent field absent', () => {
    const dto = plainToInstance(UpdatePageBlockDto, { itemCount: 3 });
    expect(dto.title).toBeUndefined();
  });
});
