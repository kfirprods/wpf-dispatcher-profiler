export function convertBooleanToText(bool: boolean) {
  return bool ? 'Yes' : 'No';
}

export function convertMillisecondsToText(milliseconds: number) {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else if (milliseconds < 1000 * 60) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  } else if (milliseconds < 1000 * 60 * 60) {
    return `${(milliseconds / 1000 / 60).toFixed(2)} mins`;
  } else {
    return `${(milliseconds / 1000 / 60 / 60).toFixed(2)}h`;
  }
}

export function convertIso8601ToTimeAgo(iso8601: string) {
  const date = new Date(iso8601);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} days ago`;
  } else if (hours > 0) {
    return `${hours} hours ago`;
  } else if (minutes > 0) {
    return `${minutes} minutes ago`;
  } else {
    return `${seconds} seconds ago`;
  }
}

export function convertDispatcherPriorityToText(priority: number) {
  switch (priority) {
    case 0:
      return 'Inactive';
    case 1:
      return 'SystemIdle';
    case 2:
      return 'ApplicationIdle';
    case 3:
      return 'ContextIdle';
    case 4:
      return 'Background';
    case 5:
      return 'Input';
    case 6:
      return 'Loaded';
    case 7:
      return 'Render';
    case 8:
      return 'DataBind';
    case 9:
      return 'Normal';
    case 10:
      return 'Send';
  }
}
