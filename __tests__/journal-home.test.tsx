import { fireEvent, render } from '@testing-library/react-native';

import JournalHomeScreen from '../app/index';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en' }],
}));

describe('JournalHomeScreen', () => {
  it('renders English and switches to Thai', async () => {
    const { getByText, getByRole } = await render(<JournalHomeScreen />);

    expect(getByText('A quiet place for your thoughts.')).toBeTruthy();
    await fireEvent.press(
      getByRole('button', { name: 'Switch language to ไทย' }),
    );
    expect(getByText('พื้นที่เงียบ ๆ สำหรับความคิดของคุณ')).toBeTruthy();
  });
});
