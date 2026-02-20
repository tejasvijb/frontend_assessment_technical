// Detect if running on macOS
export const IS_MAC =
    typeof window !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);
