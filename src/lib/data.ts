export type Student = {
  id: string;
  name: string;
  promotion: string;
  department: string;
  faculty: string;
  attendance: number;
  absences: number;
  tardiness: number;
};

export const faculties = [
  { id: 'f1', name: 'Sciences et Technologies' },
  { id: 'f2', name: 'Sciences Économiques et de Gestion' },
  { id: 'f3', name: 'Droit et Sciences Politiques' },
  { id: 'f4', name: 'Médecine' },
  { id: 'f5', name: 'Sciences Sociales' },
];

export const departments = {
  f1: [
    { id: 'd101', name: 'Informatique' },
    { id: 'd102', name: 'Génie Civil' },
  ],
  f2: [
    { id: 'd201', name: 'Économie' },
    { id: 'd202', name: 'Gestion' },
  ],
  f3: [
    { id: 'd301', name: 'Droit Privé' },
    { id: 'd302', name: 'Droit Public' },
  ],
  f4: [{ id: 'd401', name: 'Tronc Commun' }],
  f5: [
    { id: 'd501', name: 'Sociologie' },
    { id: 'd502', name: 'Psychologie' },
  ],
};

export const promotions = {
  d101: [
    { id: 'p1011', name: 'G1 Informatique' },
    { id: 'p1012', name: 'G2 Informatique' },
  ],
  d201: [
    { id: 'p2011', name: 'G1 Économie' },
    { id: 'p2012', name: 'G2 Économie' },
  ],
  d301: [{ id: 'p3011', name: 'G1 Droit' }],
  d401: [{ id: 'p4011', name: 'G3 Médecine' }],
};

export const presenceData = {
  overall: { attendanceRate: 85, absences: 1200, tardiness: 350 },
  byFaculty: [
    {
      faculty: 'Sciences et Technologies',
      attendanceRate: 88,
      absences: 300,
      tardiness: 80,
    },
    {
      faculty: 'Sciences Économiques et de Gestion',
      attendanceRate: 82,
      absences: 450,
      tardiness: 120,
    },
    {
      faculty: 'Droit et Sciences Politiques',
      attendanceRate: 86,
      absences: 250,
      tardiness: 70,
    },
    { faculty: 'Médecine', attendanceRate: 92, absences: 100, tardiness: 30 },
    {
      faculty: 'Sciences Sociales',
      attendanceRate: 79,
      absences: 500,
      tardiness: 150,
    },
  ],
};

export const students: Student[] = [
  {
    id: 's001',
    name: 'Jean Dupont',
    promotion: 'G1 Informatique',
    department: 'Informatique',
    faculty: 'Sciences et Technologies',
    attendance: 95,
    absences: 2,
    tardiness: 1,
  },
  {
    id: 's002',
    name: 'Marie Curie',
    promotion: 'G2 Économie',
    department: 'Économie',
    faculty: 'Sciences Économiques et de Gestion',
    attendance: 98,
    absences: 1,
    tardiness: 0,
  },
  {
    id: 's003',
    name: 'Pierre Martin',
    promotion: 'G1 Informatique',
    department: 'Informatique',
    faculty: 'Sciences et Technologies',
    attendance: 80,
    absences: 10,
    tardiness: 5,
  },
  {
    id: 's004',
    name: 'Sophie Dubois',
    promotion: 'G1 Droit',
    department: 'Droit Privé',
    faculty: 'Droit et Sciences Politiques',
    attendance: 75,
    absences: 12,
    tardiness: 8,
  },
  {
    id: 's005',
    name: 'Luc Bernard',
    promotion: 'G3 Médecine',
    department: 'Tronc Commun',
    faculty: 'Médecine',
    attendance: 99,
    absences: 0,
    tardiness: 1,
  },
  {
    id: 's006',
    name: 'Alice Petit',
    promotion: 'G1 Informatique',
    department: 'Informatique',
    faculty: 'Sciences et Technologies',
    attendance: 60,
    absences: 20,
    tardiness: 10,
  },
  {
    id: 's007',
    name: 'Thomas Moreau',
    promotion: 'G2 Économie',
    department: 'Économie',
    faculty: 'Sciences Économiques et de Gestion',
    attendance: 96,
    absences: 2,
    tardiness: 0,
  },
  {
    id: 's008',
    name: 'Camille Lefebvre',
    promotion: 'G1 Droit',
    department: 'Droit Privé',
    faculty: 'Droit et Sciences Politiques',
    attendance: 88,
    absences: 6,
    tardiness: 2,
  },
  {
    id: 's009',
    name: 'Nicolas Roux',
    promotion: 'G3 Médecine',
    department: 'Tronc Commun',
    faculty: 'Médecine',
    attendance: 94,
    absences: 3,
    tardiness: 2,
  },
  {
    id: 's010',
    name: 'Léa Garcia',
    promotion: 'G1 Informatique',
    department: 'Informatique',
    faculty: 'Sciences et Technologies',
    attendance: 91,
    absences: 4,
    tardiness: 1,
  },
];

export const attendanceAnomalyData = JSON.stringify([
  {
    studentId: 's001',
    classId: 'c101',
    attendanceDate: '2023-10-01T09:00:00Z',
    status: 'present',
  },
  {
    studentId: 's003',
    classId: 'c101',
    attendanceDate: '2023-10-01T09:00:00Z',
    status: 'absent',
  },
  {
    studentId: 's006',
    classId: 'c101',
    attendanceDate: '2023-10-01T09:00:00Z',
    status: 'absent',
  },
  {
    studentId: 's001',
    classId: 'c102',
    attendanceDate: '2023-10-02T11:00:00Z',
    status: 'present',
  },
  {
    studentId: 's003',
    classId: 'c102',
    attendanceDate: '2023-10-02T11:00:00Z',
    status: 'present',
  },
  {
    studentId: 's006',
    classId: 'c101',
    attendanceDate: '2023-10-03T09:00:00Z',
    status: 'absent',
  },
  {
    studentId: 's006',
    classId: 'c101',
    attendanceDate: '2023-10-05T09:00:00Z',
    status: 'absent',
  },
  {
    studentId: 's006',
    classId: 'c101',
    attendanceDate: '2023-10-08T09:00:00Z',
    status: 'absent',
  },
]);
