export interface IAddress {
    name: string;
    email: string;
    phone: string;
    address: string;
    shipping_address: string;
    city: string;
    state: string;
    country: string;
    xid: string;
    zipcode: number;
}

export interface ICity {
    code: number;
    codename: string;
    division_type: string;
    name: string;
    phone_code: number;
    districts: IDistrict[];
}

export interface IDistrict {
    code: number;
    codename: string;
    division_type: string;
    name: string;
    province_code: number;
}