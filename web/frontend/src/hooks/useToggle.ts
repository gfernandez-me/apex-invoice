import { useCallback, useState } from 'react';

export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggleValue = useCallback(() => {
    setValue((value) => !value);
  }, []);

  return [value, toggleValue];
}
