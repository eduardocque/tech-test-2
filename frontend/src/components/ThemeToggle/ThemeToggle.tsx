import { useTheme } from 'next-themes';
import { useCallback } from 'react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleChangeTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [setTheme, theme]);

  return (
    <button
      onClick={handleChangeTheme}
      className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggle;
