import BaseCard from '../../components/card';
import profile from '../../assets/profile.png'
import LOGO from '../../assets/LOGO.png'
import Button from '../../components/button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CarRentalLoginScreen() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/home');
    } else if (localStorage.getItem('agent')) {
      navigate('/agent');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col font-jakarta items-center justify-center min-h-screen p-4 text-white  bg-custom-login-gradient">
      {/* Logo and Welcome Text */}
      <div className="flex flex-col items-center mb-8">
        <img src={LOGO} alt="logo" className='rounded-full w-[120px] h-[120px]' />
        <h1 className="text-[36px] font-bold mb-2">Welcome to Online Car Rental </h1>
        <div className="text-center text-[24px] opacity-80">
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center">
        {/* Car Agent */}
        <BaseCard 
          bgColor="bg-custom-login-gradient"
          padding="p-3"
          width="w-auto"
          height=""
          isFlexible
        >
          <div className="flex flex-col items-center">
            <img src={profile} alt="logo" className='rounded-full border-[5px] border-[#383838] w-[200px]' />
            <h2 className="text-xl font-bold mb-4 text-white">Car Agent</h2>
            <Button
            to='/agent-login'
              title="Login"
              rounded='rounded-[35px]'
              textColor='text-black'
              bgColor='bg-white'

            />
          </div>
        </BaseCard>

        {/* Car Customer */}
        <BaseCard 

          bgColor="bg-custom-login-gradient"
          padding="p-3"
          width="w-auto"
          height="h-auto"
          isFlexible
        >
          <div className="flex flex-col items-center">
            <img src={profile} alt="logo" className='rounded-full border-[5px] border-[#383838] w-[200px]' />
            <h2 className="text-xl font-bold mb-4 text-white">Car Customer</h2>
            <Button
            to='/login'
              title="Login"
              rounded='rounded-[35px]'
              textColor='text-black'
              bgColor='bg-white'
            />
          </div>
        </BaseCard>
      </div>
    </div>
  );
}