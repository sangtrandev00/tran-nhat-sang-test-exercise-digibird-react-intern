import { useRecoilValueLoadable} from 'recoil'
import { getAddressListAsync, getCityListAsync, getDistrictListByProvinceIdAsync } from '../store/address_state'
import SkeletonAddress from './components/SkeletonAddress';
import { IAddress, IDistrict } from '../types/Address';
import FormAddress from './components/FormAddress';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function EditAddress() {
  
  // List of hooks
  const cityListLoadable = useRecoilValueLoadable(getCityListAsync);
  const districtListLoadable = useRecoilValueLoadable(getDistrictListByProvinceIdAsync);
  const addressListAsyncLoadable  = useRecoilValueLoadable(getAddressListAsync);
  // Get Current id from url
  const { addressId } = useParams();

  // When city list is loading
  if (cityListLoadable.state === 'loading' || addressListAsyncLoadable.state === 'loading') {
    return <SkeletonAddress/>;
  }

  // When city list has error
  if (cityListLoadable.state === 'hasError' || addressListAsyncLoadable.state === 'hasError') {
    return <div>Error: {cityListLoadable.contents}</div>;
  }


  // Convert to array list from globale state
  const addressList = addressListAsyncLoadable.contents.data;
  const cityList = cityListLoadable.contents;
  const districtList = districtListLoadable.contents.districts as IDistrict[];

  const currentAddress = addressList.find((city) => city.xid === addressId);

  console.log("current address: ", currentAddress);
  console.log("district: ", districtList);

  return (
    <FormAddress  cityList={cityList} districtList={districtList} currentAddress={currentAddress as IAddress}/>
  )
}

export default EditAddress