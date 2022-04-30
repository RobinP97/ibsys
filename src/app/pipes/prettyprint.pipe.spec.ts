import { PrettyPrintPipe } from './prettyprint.pipe';

describe('PrettyprintPipe', () => {
  it('create an instance', () => {
    const pipe = new PrettyPrintPipe();
    expect(pipe).toBeTruthy();
  });
});
