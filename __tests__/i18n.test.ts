import { translations } from '../i18n';

describe('translations', () => {
  it('includes journal copy in English and Thai', () => {
    expect(translations.en.title).toBe('A quiet place for your thoughts.');
    expect(translations.th.title).toBe('พื้นที่เงียบ ๆ สำหรับความคิดของคุณ');
  });

  it('contains matching keys in both supported locales', () => {
    expect(Object.keys(translations.en).sort()).toEqual(
      Object.keys(translations.th).sort(),
    );
  });
});
