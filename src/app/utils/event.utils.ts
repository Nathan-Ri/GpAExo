let eventGuid = 0;

export function createEventId() {
  return String(eventGuid++);
}

export function getColor(selectedProject: string): string {
  switch (selectedProject) {
    case 'Super Secret Project1':
      return '#f00000'
    case 'Super Secret Project2':
      return '#f000f0'
    case 'Super Secret Project3':
      return '#00f000'
    case 'vacances':
      return '#55555555'
    default:
      return '#55555555'
  }
}
