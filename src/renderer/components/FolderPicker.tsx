import { useEffect, useRef } from 'react';

/**
 * FolderPicker – uses the native OS directory picker dialog.
 *
 * Props:
 *   value     – currently selected path (empty string = none)
 *   onChange  – called with the chosen absolute path
 *   onClose   – called when the modal should be dismissed
 */

export function FolderPicker({
  onChange,
  onClose,
}: {
  value: string;
  onChange: (path: string) => void;
  onClose: () => void;
}) {
  const openedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const onCloseRef = useRef(onClose);
  onChangeRef.current = onChange;
  onCloseRef.current = onClose;

  useEffect(() => {
    if (openedRef.current) {
      return;
    }
    openedRef.current = true;

    if (window.electronAPI) {
      window.electronAPI.selectDirectory().then((selected) => {
        if (selected) {
          onChangeRef.current(selected);
        }
        onCloseRef.current();
      });
    } else {
      onCloseRef.current();
    }
  }, []);

  return null;
}
