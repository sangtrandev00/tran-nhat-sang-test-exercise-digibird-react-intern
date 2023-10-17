import { atom, selector } from "recoil";
import { IAddress, ICity } from "../types/Address";
import { BEARER_TOKEN } from "../constant/token";

// Default state value of address
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


// State of current id of current selected provice
export const currentSelectedProvinceId = atom<string>({
  key: "currentSelectedProvinceId",
  default: ""
})


// 2. Async Selectors

// Get All Address List from Remote Server
export const getAddressListAsync = selector<IAddressListResponse>({
    key: 'getAddressListAsync',
    get: async () => {
      const response = await fetch('https://test-pos.digibird.io/api/v1/front/self/address?fields=id,xid,name,email,phone,address,shipping_address,city,state,country', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "authorization": `Bearer ${BEARER_TOKEN}`
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



