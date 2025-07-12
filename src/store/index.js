import { configureStore, createSlice } from "@reduxjs/toolkit";

const employees = [
  {
    id: 1,
    firstName: "Tahsin",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 2,
    firstName: "Sezin",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 3,
    firstName: "Esin",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 4,
    firstName: "Aylin",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 5,
    firstName: "Emin",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 6,
    firstName: "Seymen",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 7,
    firstName: "Eymen",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 8,
    firstName: "Onat",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 9,
    firstName: "Serife",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 10,
    firstName: "Arife",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 11,
    firstName: "Cemile",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
  {
    id: 12,
    firstName: "Ali",
    lastName: "Yazkan",
    dateOfEmployment: "23/09/2022",
    dateOfBirth: "02/02/1991",
    phone: "+905354641232",
    email: "sezin@gmail.com",
    department: "Development",
    position: "Designer",
  },
];

const defaultState = { employees };

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
      const newState = state.push(action.payload);
      saveState({ employees: newState });
      return newState;
    },
    updateEmployee: (state, action) => {
      const idx = state.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteEmployee: (state, action) => {
      return state.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } =
  employeesSlice.actions;

export const store = configureStore({
  reducer: {
    employees: employeesSlice.reducer,
  },
});
