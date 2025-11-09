


export enum SubjectType {
  Theory = 0,
  Practical = 1
}

export const SubjectTypeArray = [
  { id: SubjectType.Theory, name: 'Theory' },
  { id: SubjectType.Practical, name: 'Practical' }
];


export function getSubjecTypeName(type: SubjectType) {
  return SubjectTypeArray.find(t => t.id == type)?.name || '--';
}