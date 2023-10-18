import '../App.css';
import '../assets/css/index.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type LoginInputs = {
    token: string;
}

function Home() {

    const { register, handleSubmit } = useForm<LoginInputs>();

    const onSubmit: SubmitHandler<LoginInputs> = (data) => {
        localStorage.setItem('token', JSON.stringify(data));
        toast.success("Đăng nhập thành công với token của bạn");
        location.assign('/address');
    }
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

            <div className="mt-10">
                <h2 className='font-bold first-letter uppercase'>Đăng nhập để tham gia</h2>
                {/* Login form to join shipping address aplication */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Using token at postman to login */}
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
