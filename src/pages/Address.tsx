import { useRecoilValueLoadable } from 'recoil'
import { getAddressListAsync } from '../store/address_state';
import SkeletonAddress from './components/SkeletonAddress';
import AddressCard from './components/AddressCard';
import { useNavigate } from 'react-router-dom';

function Address() {

  const addressListLoadable = useRecoilValueLoadable(getAddressListAsync);
  
  const navigate = useNavigate();

  // Load skeleton when call API address List
  if (addressListLoadable.state === 'loading') {
    return <SkeletonAddress/>;
  }
  // Show error when call API fail
  if (addressListLoadable.state === 'hasError') {
    return <div>Error: {addressListLoadable.contents}</div>;
  }
  
  // handle addresslist from response
  const addressList = addressListLoadable.contents.data;
  
  return (
    <div className="address">
      <div className="text-center p-4 bg-primary-color w-full font-bold">Trang danh sách địa chỉ</div>
      <div className="address__create border border-gray-300 p-4">
        <div className="address__create-wrap border-2 border-dashed flex justify-center items-center p-8 flex-col">
          <div onClick={() => navigate('/add-address')} className="address__create-btn-wrap rounded-full border-2 border-dashed py-2 px-4 text-gray-400 cursor-pointer">
            <i className="fa-solid fa-plus"></i>
          </div>
          <button onClick={() => navigate('/add-address')} className="address__create-btn py-1 px-2 bg-gray-200 font-bold mt-2 rounded-sm">
            Thêm mới
          </button>
        </div>
      </div>
      {addressList.map((address) => {
        return <AddressCard key={address.xid} address={address}/>
      })}
    </div>
  )
}

export default Address