
import { useState } from 'react';
import { IAddress } from '../types/Address';

const useMutation = async (endpoints: string,formData: Omit<IAddress, "xid">, addressId: string) => {

    const [isLoading, setIsLoading] = useState(false)

    try {
        // const res = await dispatch(addPost(formData))
        // const result = unwrapResult(res);
        // console.log(result);
        setIsLoading(true);
        let response = null;

        if(addressId) {
            response= await fetch(`${endpoints}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formData, xid: addressId}),
              });
        }else {
            response= await fetch(`http://localhost:4000/${endpoints}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              });
        }

     const result = await response.json();
     return {
        data: result,
        error: null,
        isLoading
     };
     
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    throw new Error(error.error);
    } finally {
        console.log("finally");
        setIsLoading(false);
    }
}



export default useMutation
