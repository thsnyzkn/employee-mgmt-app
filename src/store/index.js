import { configureStore, createSlice } from "@reduxjs/toolkit";

const employees = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Smith",
    dateOfEmployment: "2020-01-15",
    dateOfBirth: "1990-05-20",
    phone: "111-222-3333",
    email: "alice.smith@example.com",
    department: "Analytics",
    position: "Senior",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Johnson",
    dateOfEmployment: "2021-03-01",
    dateOfBirth: "1992-11-10",
    phone: "444-555-6666",
    email: "bob.johnson@example.com",
    department: "Tech",
    position: "Medior",
  },
  {
    id: 3,
    firstName: "Charlie",
    lastName: "Brown",
    dateOfEmployment: "2022-07-20",
    dateOfBirth: "1995-02-28",
    phone: "777-888-9999",
    email: "charlie.brown@example.com",
    department: "Analytics",
    position: "Junior",
  },
  {
    id: 4,
    firstName: "Diana",
    lastName: "Prince",
    dateOfEmployment: "2019-09-01",
    dateOfBirth: "1988-08-12",
    phone: "123-456-7890",
    email: "diana.prince@example.com",
    department: "Tech",
    position: "Senior",
  },
  {
    id: 5,
    firstName: "Eve",
    lastName: "Davis",
    dateOfEmployment: "2023-01-01",
    dateOfBirth: "1998-04-05",
    phone: "987-654-3210",
    email: "eve.davis@example.com",
    department: "Analytics",
    position: "Junior",
  },
  {
    id: 6,
    firstName: "Frank",
    lastName: "White",
    dateOfEmployment: "2020-06-10",
    dateOfBirth: "1991-01-25",
    phone: "555-123-4567",
    email: "frank.white@example.com",
    department: "Tech",
    position: "Medior",
  },
  {
    id: 7,
    firstName: "Grace",
    lastName: "Black",
    dateOfEmployment: "2022-02-14",
    dateOfBirth: "1996-07-07",
    phone: "333-222-1111",
    email: "grace.black@example.com",
    department: "Analytics",
    position: "Junior",
  },
  {
    id: 8,
    firstName: "Henry",
    lastName: "Green",
    dateOfEmployment: "2018-11-11",
    dateOfBirth: "1985-03-15",
    phone: "666-777-8888",
    email: "henry.green@example.com",
    department: "Tech",
    position: "Senior",
  },
  {
    id: 9,
    firstName: "Ivy",
    lastName: "King",
    dateOfEmployment: "2021-05-01",
    dateOfBirth: "1993-09-30",
    phone: "222-333-4444",
    email: "ivy.king@example.com",
    department: "Analytics",
    position: "Medior",
  },
  {
    id: 10,
    firstName: "Jack",
    lastName: "Lee",
    dateOfEmployment: "2023-04-20",
    dateOfBirth: "1999-12-01",
    phone: "888-999-0000",
    email: "jack.lee@example.com",
    department: "Tech",
    position: "Junior",
  },
];

const defaultState = { employees, lang: "en" };

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("appState");
    return serializedState ? JSON.parse(serializedState) : defaultState;
  } catch (err) {
    return defaultState;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("appState", serializedState);
  } catch (err) {
    // Ignore write errors
    console.error(err);
  }
};
const initialState = loadState();
const employeesSlice = createSlice({
  name: "employees",
  initialState: initialState.employees,
  reducers: {
    addEmployee: (state, action) => {
      const maxId =
        state.length > 0 ? Math.max(...state.map((emp) => emp.id)) : 0;
      const newEmployee = { ...action.payload, id: maxId + 1 };
      const newState = [...state, newEmployee];
      saveState({ employees: newState });
      return newState;
    },
    updateEmployee: (state, action) => {
      const newState = state.map((employee) =>
        employee.id === action.payload.id ? action.payload : employee
      );
      saveState({ employees: newState });
      return newState;
    },
    deleteEmployee: (state, action) => {
      const newState = state.filter((e) => e.id !== action.payload);
      saveState({ employees: newState });
      return newState;
    },
    deleteSelectedEmployees: (state, action) => {
      const idsToDelete = new Set(action.payload);
      const newState = state.filter((e) => !idsToDelete.has(e.id));
      console.log({ newState });
      saveState({ employees: newState });
      return newState;
    },
  },
});

const langSlice = createSlice({
  name: "lang",
  initialState: initialState.lang || "en",
  reducers: {
    setLang: (_state, action) => {
      const newState = action.payload;
      saveState({ ...initialState, lang: newState });
      return newState;
    },
  },
});

export const { setLang } = langSlice.actions;

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  deleteSelectedEmployees,
} = employeesSlice.actions;

export const store = configureStore({
  reducer: {
    lang: langSlice.reducer,
    employees: employeesSlice.reducer,
  },
});
