import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IAddress } from '../../../types/Address';

const AddressCard = ({address}: {address: IAddress}) => {

    const navigate = useNavigate();

    const detailAddress = `${address.address}, ${address.state}, ${address.city}, ${address.country}`

  return (
    <div className="address-card p-6 border-2 border-gray-300 mt-4 rounded-sm shadow-md">
        {/* Card Header With Name Section */}
      <div className="address-card__header flex items-center justify-between">
        <div className="address-card__header-name font-bold">Họ và tên: {address.name}</div>
        <span className="address-card__header-btn-delete text-red-600 cursor-pointer">Xóa</span>
      </div>
      {/* Card Location Section */}
      <div className="address-card__location mt-4">
        <div className="address-card__location-header">
            <i className="fa-solid fa-location-dot opacity-50"></i>
            <span className="font-light ml-2">Địa chỉ: </span>
        </div>
        <div className="address-card__location-content">
        {detailAddress}
        </div>
      </div>
      {/* Card Phone Section */}
      <div className="address-card__phone mt-4">
        <div className="address-card__phone-header">
                <i className="fa-solid fa-phone-volume opacity-50"></i>
            <span className="font-light ml-2">Điện thoại: </span>
        </div>
        <div className="address-card__phone-content">
           {address.phone}
        </div>
      </div>

      {/* Card Email Section */}
      <div className="address-card__email mt-4">
        <div className="address-card__email-header">
            <i className="fa-solid fa-envelope opacity-50"></i>
            <span className="font-light ml-2">Email: </span>
        </div>
        <div className="address-card__email-content">
            {address.email}
        </div>
      </div>

        {/* Card Action Section */}

        <div className="address-card__actions ">
            <button onClick={() => navigate(`/address/${address.xid}`)} className="address-card__actions-btn-edit text-blue-500 mt-4">Chỉnh sửa</button>
        </div>
    </div>
  )
}

export default AddressCard
