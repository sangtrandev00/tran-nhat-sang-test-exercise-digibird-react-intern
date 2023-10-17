import { atom, selector } from "recoil";
import { IAddress, ICity } from "../types/Address";

export const defaultAddressValue = {
  name: "",
  email: "",
  phone: "",
  address: "",
  shipping_address: "",
  city: "",
  state: "",
  country: "",
  xid: "",
  zipcode: 0
}

// type of response from server
interface IAddressListResponse {
  data: IAddress[];
  meta: {
    paging: {
      links: [];
      total: number;
    },
    time: number;
  }
}

// State of all address
export const addressListState = atom<IAddress[]>({
    key: 'addressList',
    default: [],
})

// State of current id of editing address
export const editingAddressIdState = atom<string>({
  key: "editingAddressId",
  default: ""
})


// State of current id of current selected provice
export const currentSelectedProvinceId = atom<string>({
  key: "currentSelectedProvinceId",
  default: ""
})

// State of current editing address
export const editingAddressState = atom<IAddress>({
  key: "editingAddress",
  default: defaultAddressValue
})

// 1. Sync Selectors

// Get all address List from Global State
export const getAddressList = selector<IAddress[]>({
  key: 'getAddressList',
  get: ({get}) => {
    const postList = get(addressListState);
    return postList;
  }
})

// 2. Async Selectors

// Get All Address List from Remote Server
export const getAddressListAsync = selector<IAddressListResponse>({
    key: 'getAddressListAsync',
    get: async () => {
      // const headerOptions = {
      //   'Content-Type': 'application/json',
         
      //     "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc0MTcyMTUsImV4cCI6MTY5NzQzOTExNSwibmJmIjoxNjk3NDE3MjE1LCJqdGkiOiJqRkU5enFzVHRWRVdEWk0wIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.f5Y3HHXVf_YqlxO8CLJtskDrFCWfdAcuUoWZ4UT4rJU"
      // }
      const response = await fetch('https://test-pos.digibird.io/api/v1/front/self/address?fields=id,xid,name,email,phone,address,shipping_address,city,state,country', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc1MDQyMzgsImV4cCI6MTY5NzUyNjEzOCwibmJmIjoxNjk3NTA0MjM4LCJqdGkiOiJXV0xaQXhoalhFOGdsSHNkIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.0A7GKL7XXadi_Y8ErEPiAcwLsLXlv-LYNlH2SIBj2QM"
        }
      });
      return response.json();
    }
})

// Get All Address List City from Public API 
export const getCityListAsync = selector<ICity[]>({
    key: 'getCityListAsync',
    get: async () => {
      const response = await fetch('https://provinces.open-api.vn/api/?depth=2');
      return response.json();
    }
})

// Get All District List State from Public API By Province Id 
export const getDistrictListByProvinceIdAsync = selector<ICity>({
    key: 'getDistrictListByProvinceIdAsync',
    get: async ({get}) => {
      const provinceId = get(currentSelectedProvinceId);
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
      return response.json();
    }
})

// Get All District List State from Public API
export const getDistrictListAsync = selector<ICity>({
    key: 'getDistrictListAsync',
    get: async () => {
      const response = await fetch(`https://provinces.open-api.vn/api/d/`);
      return response.json();
    }
})

