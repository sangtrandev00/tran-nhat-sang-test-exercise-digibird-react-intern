import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { currentSelectedProvinceId, getCityListAsync, getDistrictListByProvinceIdAsync } from '../store/address_state'
import SkeletonAddress from './components/SkeletonAddress';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IAddress, IDistrict } from '../types/Address';
import useMutation from '../hooks/useMutation';

function AddAddress() {

  const cityListLoadable = useRecoilValueLoadable(getCityListAsync);
  const districtListLoadable = useRecoilValueLoadable(getDistrictListByProvinceIdAsync);
  const setSelectedProvinceId = useSetRecoilState(currentSelectedProvinceId);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Omit<IAddress, "xid">>();


  if (cityListLoadable.state === 'loading') {
    return <SkeletonAddress/>;
  }

  if (cityListLoadable.state === 'hasError') {
    return <div>Error: {cityListLoadable.contents}</div>;
  }

  const cityList = cityListLoadable.contents;
  const districtList = districtListLoadable.contents.districts as IDistrict[];

  console.log(districtList);

  const handleChangeCities = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvinceId =e.target.value;
    console.log("change city event: ", selectedProvinceId);
    setSelectedProvinceId(selectedProvinceId);
  }

  const onSubmit: SubmitHandler<Omit<IAddress, "xid">> = (data) => {
    console.log(data);
    const formData = data;
    const requestData = async () => {
      const res = await fetch(
        "https://test-pos.digibird.io/api/v1/front/self/address", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc0MTcyMTUsImV4cCI6MTY5NzQzOTExNSwibmJmIjoxNjk3NDE3MjE1LCJqdGkiOiJqRkU5enFzVHRWRVdEWk0wIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.f5Y3HHXVf_YqlxO8CLJtskDrFCWfdAcuUoWZ4UT4rJU'
          }
        }
      );
        console.log(res);
        const result = await res.json();
        console.log("result: ", result);

      };
      requestData();

  };
  



  return (
    <div className="add-address border-2 border-gray-300">
      <div className="add-address__header px-4 py-2 font-bold border-b-2 border-gray-300">
        Thêm mới địa chỉ
      </div>
      <div className="add-address__content p-4">
          <form onSubmit={handleSubmit(onSubmit)} action="" className="add-address__form">
              {/* Name Input Group Section */}
              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                  <i className="fa-regular fa-user text-gray-400"></i> <span className="font-medium ml-1">Họ và tên</span>
                </label>
                <input {...register("name", {required: true})} className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" type="text" placeholder="Nguyễn Văn Ánh"/>
              </div>
              {/* Phone Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-phone text-gray-400"></i><span className="font-medium ml-1">Số điện thoại</span>
                </label>
                <input className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" type="text" placeholder="0 xxx xxx xxx"/>
              </div>
          
              {/* Email Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-regular fa-envelope text-gray-"></i> <span className="font-medium ml-1">Email</span>
                </label>
                <input {...register("email", {required: true})} className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" type="text" placeholder="example@example"/>
              </div>

              {/* Location City Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Tỉnh, thành phố</span>
                </label>
                <select {...register("city", {required: true})} onChange={handleChangeCities} className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" type="text" placeholder="example@example">
                  <option value="">Chọn tỉnh/thành phố</option>
                  {cityList.map((cityItem) => {
                    return <option key={cityItem.code} value={cityItem.code}>{cityItem.name}</option>
                  })}
                </select>
              </div>

              {/* Location State Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Quận, huyện</span>
                </label>
                <select {...register("state", {required: true})} className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" type="text" placeholder="example@example">
                <option value="">Chọn quận/ huyện</option>
                    {(districtList || [] ).map((districtItem) => {
                      return <option key={districtItem.code} value={districtItem.code}>{districtItem.name}</option>
                    })}
                </select>
              </div>

              {/* Location Specific Address Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Địa chỉ cụ thể</span>
                </label>
                <input {...register("address", {required: true})} className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" type="text" placeholder="23 đường số 8, phường Linh Trung,..."/>
              </div>
              <div className="add-address__actions">
                <button className="add-address__actions-btn bg-primary-color py-2 px-4 font-medium rounded-md">Lưu thông tin</button>
              </div>

          </form>
      </div>
    </div>
  )
}

export default AddAddress