import React, { useEffect, useState } from 'react';
import { IAddress, ICity, IDistrict } from '../../../types/Address';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useSetRecoilState } from 'recoil';
import { currentSelectedProvinceId, getAddressListAsync } from '../../../store/address_state';
import SkeletonAddress from '../SkeletonAddress';
import { toast } from 'react-toastify';
import { BEARER_TOKEN } from '../../../constant/token';

const FormAddress = ({cityList, districtList, currentAddress }: { cityList: ICity[], districtList: IDistrict[], currentAddress: IAddress}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const currentCodeCity = cityList.find((city) => city.name.includes(currentAddress?.city))?.code;

  // Using react-hook-form to handle form
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Omit<IAddress, "xid">>();

  // Set current city (province id) for global state
  const setSelectedProvinceId = useSetRecoilState(currentSelectedProvinceId);
  const [cityName, setCityName] = useState(currentAddress.city || "");
  const [districtName, setDistrictName] = useState(currentAddress.state || "");
  const [mainDistrictList, setMainDistrictList] = useState<IDistrict[]>(districtList);
  const [currentDistrict, setCurrentDistrict] = useState<IDistrict>();
  const refresh = useRecoilRefresher_UNSTABLE(getAddressListAsync);
  useEffect(() => {
    if(currentAddress.xid) {
      // console.log("current city: ", currentAddress);
      fetch(`https://provinces.open-api.vn/api/d`).then((res) => res.json()).then((districtList: IDistrict[]) => {
        
        const currentDistrict = districtList.find((district) => district.name === currentAddress.state);

      const districtListByProvinceId = districtList.filter((district) => district.province_code === currentCodeCity);
      setMainDistrictList(districtListByProvinceId);
        setCurrentDistrict(currentDistrict as IDistrict);
      })
    }
  }, [currentAddress, currentCodeCity])
 
  // set is loading state when request to server
  const [isLoading, setIsLoading] = useState(false);

  // Handle change provinces
  const handleChangeCities = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvinceId =e.target.value;
    // setValue("city", e.target.innerText);
    console.log("e.target.innerText: ", e.target.selectedOptions[0].innerText);
    setCityName(e.target.selectedOptions[0].innerText);
    setSelectedProvinceId(selectedProvinceId);
  }

  const handleChangeState = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictName(e.target.selectedOptions[0].innerText);
  }

  // Submit form handler
  const onSubmit: SubmitHandler<Omit<IAddress, "xid">> = (data) => {
    const formData = {
      ...data,
      zipcode: 1,
      country: "VN",
      city: cityName,
      state: districtName,
    };

    // Send POST/PUT request to backend API
    const requestData = async () => {
      setIsLoading(true);
      try {
        let res;

        // PUT Request when edit form
        if(currentAddress.xid) {
          res = await fetch(
            `https://test-pos.digibird.io/api/v1/front/self/address/${currentAddress.xid}`, {
              method: "PUT",
              body: JSON.stringify(formData),
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${BEARER_TOKEN}`
              }
            }
          );
        }else{
           // POST Request when add form
          res = await fetch(
            "https://test-pos.digibird.io/api/v1/front/self/address", {
              method: "POST",
              body: JSON.stringify(formData),
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${BEARER_TOKEN}`
              }
            }
          );
        }

        if (!res.ok) {
          // If the response status is not OK (e.g., 404 Not Found), throw an error.
          throw new Error(`Network response was not ok, status: ${res.status}`);
        }

          const result = await res.json();
        // Reset when submit post request successfully!
        if(!currentAddress.xid) {
          reset({
            name: "",
            email: "",
            phone: "",
            address: "",
            shipping_address: "",
            city: "",
            state: "",
            country: "",
            zipcode: 0
          });
        }
        // Reset list of API when update/or add new address
        refresh();
          
        // Show toast successfully!
        toast.success(result.message);

      } catch (error : any) {

        toast.warning(error.message);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }

      };
      requestData();
  };

  // Load Skeleton when request is loading from server
  if(isLoading) {
    return <SkeletonAddress/>
  }

  console.log("mainDistrictList: ", mainDistrictList);
  console.log(errors);
  return (
    
    <div className="add-address border-2 border-gray-300">
      <div className="add-address__header px-4 py-2 font-bold border-b-2 border-gray-300 bg-primary-color">
        <div onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i> <span>Trở lại</span></div>
        <div className="text-center"><span className="">{path === "/add-address" ? "Thêm mới địa chỉ": "Chỉnh sửa địa chỉ"}</span></div>
      </div>
      <div className="add-address__content p-4">
          <form onSubmit={handleSubmit(onSubmit)} action="" className="add-address__form">
              {/* Name Input Group Section */}
              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                  <i className="fa-regular fa-user text-gray-400"></i> <span className="font-medium ml-1">Họ và tên</span>
                </label>
                <input 
                {...register("name", {required: true})} 
                defaultValue={currentAddress?.name || ""} 
                className={`add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2`} 
                type="text" 
                placeholder="Nguyễn Văn Ánh"
                />

              {errors.name?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Họ và Tên không được để trống</p>}

              </div>
              {/* Phone Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-phone text-gray-400"></i><span className="font-medium ml-1">Số điện thoại</span>
                </label>
                <input 
                {...register("phone", {required: true, pattern: /^(0\d{9}|84\d{8,9})$/})} 
                defaultValue={currentAddress?.phone || ""} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" 
                type="text" 
                placeholder="0 xxx xxx xxx"
                />
              {errors.phone?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường điện thoại không được để trống</p>}
              {errors.phone?.type === 'pattern' && <p className="mt-2 text-sm text-red-600" role="alert">Trường điện thoại không đúng định dạng</p>}

              </div>
          
              {/* Email Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-regular fa-envelope text-gray-400"></i> <span className="font-medium ml-1">Email</span>
                </label>
                <input 
                {...register("email", {required: true, pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/})} 
                defaultValue={currentAddress?.email || ""} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" 
                type="text" 
                placeholder="example@example"
                // onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                />
              {errors.email?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Email không được để trống</p>}
              {errors.email?.type === 'pattern' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Email không đúng định dạng</p>}

              </div>

              {/* Location City Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                  <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Tỉnh, thành phố</span>
                </label>
                <select 
                {...register("city", {required: true,  onChange: handleChangeCities})} 
                defaultValue={currentAddress.xid ? currentCodeCity : ""} 
                // onChange={handleChangeCities} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" 
                placeholder="example@example"
                
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {cityList.map((cityItem) => {
                    return <option key={cityItem.code} value={cityItem.code}>{cityItem.name}</option>
                  })}
                </select>
              {errors.city?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Tỉnh, thành phố không được để trống</p>}

              </div>

              {/* Location State Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                  <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Quận, huyện</span>
                </label>
                <select 
                {...register("state", {required: true, onChange: handleChangeState})} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2"  
                placeholder="example@example"
                // onChange={(event) => setFormData((prev) => ({ ...prev, state: event.target.value }))}
                
                >
               {currentAddress.xid && (<option selected value={currentDistrict?.code || ""}>{currentDistrict?.name || "Chọn quận/ huyện"}</option>)} 
                {!currentAddress.xid && (<option value="">Chọn quận/ huyện</option>) }
                    {(districtList || [] ).map((districtItem) => {
                      return <option key={districtItem.code} value={districtItem.code}>{districtItem.name}</option>
                    })}
                </select>
              {errors.state?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Quận, huyện không được để trống</p>}

              </div>

              {/* Location Specific Address Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                  <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Địa chỉ cụ thể</span>
                </label>
                <input 
                defaultValue={currentAddress?.address || ""} 
                {...register("address", {required: true})} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" 
                type="text" 
                placeholder="23 đường số 8, phường Linh Trung,..."
                // onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))}
                />
              {errors.address?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Địa chỉ không được để trống</p>}
                
              </div>

              {/* Location Shipping Address Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Địa chỉ giao hàng</span>
                </label>
                <input 
                defaultValue={currentAddress?.shipping_address || ""} 
                {...register("shipping_address", {required: true})} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" 
                type="text" 
                placeholder="Địa chỉ giao hàng: abcdc"
                // onChange={(event) => setFormData((prev) => ({ ...prev, shipping_address: event.target.value }))}
                />
              {errors.shipping_address?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường địa chỉ giao hàng không được để trống</p>}
              </div>
              <div className="add-address__actions">
                <button className="add-address__actions-btn bg-primary-color py-2 px-4 font-medium rounded-md">Lưu thông tin</button>
              </div>

          </form>
      </div>
    </div>
  )
}

export default FormAddress
