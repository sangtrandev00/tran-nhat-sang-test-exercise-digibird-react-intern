import { useRecoilValueLoadable } from 'recoil'
import { defaultAddressValue, getCityListAsync, getDistrictListByProvinceIdAsync } from '../store/address_state'
import SkeletonAddress from './components/SkeletonAddress';
import {IDistrict } from '../types/Address';
import FormAddress from './components/FormAddress';


function AddAddress() {
  
  // List of hooks
  const cityListLoadable = useRecoilValueLoadable(getCityListAsync);
  const districtListLoadable = useRecoilValueLoadable(getDistrictListByProvinceIdAsync);

  // When city list is loading
  if (cityListLoadable.state === 'loading') {
    return <SkeletonAddress/>;
  }

  // When city list has error
  if (cityListLoadable.state === 'hasError') {
    return <div>Error: {cityListLoadable.contents}</div>;
  }

  // Convert to array list from global remote state
  const cityList = cityListLoadable.contents;

  // Convert to District list from global remote state of district public API
  const districtList = districtListLoadable.contents.districts as IDistrict[];
  console.log("district list from add address", districtList);


  return (
    <FormAddress cityList={cityList} districtList={districtList} currentAddress={defaultAddressValue}/>
  )
}

export default AddAddress