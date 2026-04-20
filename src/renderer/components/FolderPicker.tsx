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
  // Immediately open native dialog
  if (window.electronAPI) {
    window.electronAPI.selectDirectory().then((selected) => {
      if (selected) {
        onChange(selected);
      }
      onClose();
    });
  } else {
    onClose();
  }

  // Render nothing — the native dialog is the UI
  return null;
}
