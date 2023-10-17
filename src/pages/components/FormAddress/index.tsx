import React, { useEffect, useState } from 'react'
import { IAddress, ICity, IDistrict } from '../../../types/Address'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSelectedProvinceId, getDistrictListAsync } from '../../../store/address_state';
import SkeletonAddress from '../SkeletonAddress';

const FormAddress = ({cityList, districtList, currentAddress }: { cityList: ICity[], districtList: IDistrict[], currentAddress: IAddress}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const currentCodeCity = cityList.find((city) => city.name.includes(currentAddress?.city))?.code;
  console.log("current address: ", currentAddress);
  console.log("district list: ", districtList);
  // Manage two-way binding form data for every input using state
  const [formData, setFormData] = useState<Omit<IAddress, "xid">>({
    ...currentAddress,
    city: currentAddress.xid ? (currentCodeCity?.toString() || "") : ""
  })
  // Using react-hook-form to handle form
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<Omit<IAddress, "xid">>();

  const { onChange, onBlur, name, ref } = register('city'); 
  // Set current city (province id) for global state
  const setSelectedProvinceId = useSetRecoilState(currentSelectedProvinceId);
  const [currentDistrict, setCurrentDistrict] = useState<IDistrict>();

  useEffect(() => {
    if(currentAddress.xid) {
      // console.log("current city: ", currentAddress);
      fetch(`https://provinces.open-api.vn/api/d`).then((res) => res.json()).then((districtList: IDistrict[]) => {
        
        const currentDistrict = districtList.find((district) => district.name === currentAddress.state);
        setCurrentDistrict(currentDistrict as IDistrict);
      
        // console.log("data district: ", data);
      })
    }
  }, [currentAddress])
 
  // set is loading state when request to server
  const [isLoading, setIsLoading] = useState(false);

  // Handle change provinces
  const handleChangeCities = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvinceId =e.target.value;
    console.log("change city event: ", selectedProvinceId);
    // setFormData((prev) => ({
    //   ...prev,
    //   city: selectedProvinceId
    // }))
    // setValue("city", selectedProvinceId);
    setSelectedProvinceId(selectedProvinceId);
  }


  const onSubmit: SubmitHandler<Omit<IAddress, "xid">> = (data) => {
    console.log(data);
    const formData = {
      ...data,
      zipcode: 1,
      country: "VN"
    };
    // Send post request to backend API
    const requestData = async () => {
      setIsLoading(true);
      try {
        let res;
        if(currentAddress.xid) {
          res = await fetch(
            `https://test-pos.digibird.io/api/v1/front/self/address/${currentAddress.xid}`, {
              method: "PUT",
              body: JSON.stringify(formData),
              headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc1MDQyMzgsImV4cCI6MTY5NzUyNjEzOCwibmJmIjoxNjk3NTA0MjM4LCJqdGkiOiJXV0xaQXhoalhFOGdsSHNkIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.0A7GKL7XXadi_Y8ErEPiAcwLsLXlv-LYNlH2SIBj2QM'
              }
            }
          );
        }else{
          res = await fetch(
            "https://test-pos.digibird.io/api/v1/front/self/address", {
              method: "POST",
              body: JSON.stringify(formData),
              headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QtcG9zLmRpZ2liaXJkLmlvL2FwaS92MS9mcm9udC9zaWduLXVwLXphbG8iLCJpYXQiOjE2OTc1MDQyMzgsImV4cCI6MTY5NzUyNjEzOCwibmJmIjoxNjk3NTA0MjM4LCJqdGkiOiJXV0xaQXhoalhFOGdsSHNkIiwic3ViIjoiMjI4MiIsInBydiI6IjFkMGEwMjBhY2Y1YzRiNmM0OTc5ODlkZjFhYmYwZmJkNGU4YzhkNjMifQ.0A7GKL7XXadi_Y8ErEPiAcwLsLXlv-LYNlH2SIBj2QM'
              }
            }
          );
        }
          console.log(res);
          const result = await res.json();
          console.log("result: ", result);
          // Reset form after submit request
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
          window.alert(result.message);


      } catch (error) {
        console.log("error: ", error);
        setIsLoading(false);
      } finally {
        console.log("finally!");
        setIsLoading(false);
      }

      };
      requestData();
  };

    // const currentCodeState = districtList.find((district) => district.name.includes(currentAddress?.city))?.code;
    console.log("city list: ", cityList);
    console.log("currentCodeCity: ", currentCodeCity);
    console.log("currentCodeCity: ", currentCodeCity);
    console.log("errors: ", errors);


  const handleOnChangeCities = (e: any) => {
    console.log("handle on change cities: ", e);
  }

    // Load Skeleton when request is loading from server
  if(isLoading) {
    return <SkeletonAddress/>
  }

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
                // onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                // onChange={(event) => setValue("name", event.target.value)}
                
                />

              {errors.name?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Họ và Tên không được để trống</p>}

              </div>
              {/* Phone Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-phone text-gray-400"></i><span className="font-medium ml-1">Số điện thoại</span>
                </label>
                <input 
                {...register("phone", {required: true})} 
                defaultValue={currentAddress?.phone || ""} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" 
                type="text" 
                placeholder="0 xxx xxx xxx"
                // onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                
                />
              {errors.phone?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường điện thoại không được để trống</p>}

              </div>
          
              {/* Email Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-regular fa-envelope text-gray-400"></i> <span className="font-medium ml-1">Email</span>
                </label>
                <input 
                {...register("email", {required: true})} 
                defaultValue={currentAddress?.email || ""} 
                className="add-address__form-input block border-2 border-gray-300 p-1 w-full mt-2" 
                type="text" 
                placeholder="example@example"
                // onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                />
              {errors.email?.type === 'required' && <p className="mt-2 text-sm text-red-600" role="alert">Trường Email không được để trống</p>}

              </div>

              {/* Location City Input Group Section */}

              <div className="add-address__form-group mb-4">
                <label htmlFor="" className="add-address__form-label">
                <i className="fa-solid fa-location-dot text-gray-400"></i> <span className="font-medium ml-1">Tỉnh, thành phố</span>
                </label>
                <select 
                {...register("city", {required: true,  onChange: handleChangeCities})} 
                defaultValue={currentCodeCity} 
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
                {...register("state", {required: true})} 
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
