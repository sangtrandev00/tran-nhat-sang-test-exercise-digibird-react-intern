import { useNavigate } from 'react-router-dom'
import '../App.css'
import '../assets/css/index.css'
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type LoginInputs = {
    // phone: string;
    // name: string;
    token: string;
}

function Home() {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();
    // const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    //     console.log(data);

    //     const loginForm = {
    //         phone: data.phone,
    //         name: data.name,
    //         company_id: '9'
    //     }

    //     const request = async () => {
    //         try {
    //             const res = await fetch(`https://test-pos.digibird.io/api/v1/front/sign-up-zalo`, {
    //                 method: 'POST',
    //                 body: JSON.stringify(loginForm),
    //                 headers: {
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                     'Set-Cookie': 'laravel_session=8fdqySp8PzfNflM5pG9HyYtxi5s9VT1zecvMzo92; expires=Tue, 17-Oct-2023 09:37:51 GMT; Max-Age=7200; path=/; httponly; samesite=lax'
    //                 }
    //             });
    
    //             if(!res.ok) {
    //                 throw new Error(`Login failed`);
    //             }

    //             const result = await res.json();
    //             console.log(result);
    
    //         } catch (error: any) {
    //             toast.warning(error.message);
    //         }
    //     }

    //     request();

    // };

    const onSubmit: SubmitHandler<LoginInputs> = (data) => {
        console.log(data);
        localStorage.setItem('token', JSON.stringify(data));
        toast.success("Đăng nhập thành công với token của bạn");
        location.assign('/address');
    }
    console.log(errors);


    return (
        <div className='container-home'>
            <div>
                <a href="https://digibird.io" target="_blank">
                    <img src='/public/logo-350x125.png' className="logo" alt="DigiBird logo" />
                </a>
            </div>
            <h1>DigiBird Test Exercise</h1>
            <h2>Kính gửi công ty Digi Bird</h2>
            <h3>Bài Test Intern của Tran Nhat Sang</h3>
            {/* <div className="card" style={{ flexDirection: 'row' }}>
                <button className='button-home' style={{ marginLeft: 10 }} onClick={() => navigate('/address')}>
                    Start
                </button>
            </div>

            <p className="read-the-docs">
                Click on the button view details exercise
            </p> */}

            <div className="mt-10">
                <h2 className='font-bold first-letter uppercase'>Đăng nhập để tham gia</h2>
                {/* Login form to join shipping address aplication */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <input className="block mx-auto w-3/4 border-gray-300 p-2 mt-2" type="text" placeholder="Số điện thoại(Id): 0869017747" {...register("phone", {required: true})} />
                    <input className="block mx-auto w-3/4 border-gray-300 p-2 mt-2" type="text" placeholder="name: Phát" {...register("name", {required: true, maxLength: 20})} /> */}
                     <label htmlFor="" className="add-address__form-label ">
                           <span className="font-medium ml-1">Sử dụng Postman Token: </span>
                    </label>
                    <input className="block mx-auto w-3/4 border-gray-300 p-2 mt-2" type="text" placeholder="Lấy token ở login post man của bạn" {...register("token", {required: true})} /> 
                    
                    <input className="bg-primary-color py-2 px-4 font-medium rounded-md cursor-pointer mt-2" type="submit" value="Đăng nhập" />
                </form>
            </div>

        </div>
    )
}

export default Home
