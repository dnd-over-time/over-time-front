'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const userInfo = localStorage.getItem('loginData');
  const { nickname, profileImageUrl } = JSON.parse(userInfo as any);

  const goBack = () => {
    router.back();
  };

  const logout = () => {};

  return (
    <div className='flex h-full flex-col justify-between'>
      <div>
        <div className='mt-[46px] mb-[50px] flex h-[50px] w-full flex-row flex-wrap items-center justify-between'>
          <Image
            onClick={goBack}
            className={'hover:cursor-pointer'}
            alt='back'
            width={24}
            height={24}
            style={{ height: 24, width: 24 }}
            src='/back-icon.png'
          />
          <div className='font-bold'>마이 페이지</div>
          <div></div>
        </div>
        <div className='grid gap-4'>
          <div className='flex h-30 w-full items-center rounded-2xl bg-white text-lg font-bold'>
            <Image
              className={'ml-8 rounded-full'}
              alt='image'
              width={75}
              height={75}
              style={{ height: 75, width: 75 }}
              src={profileImageUrl}
            />
            <div className={'ml-6'}>안녕하세요, {nickname}님</div>
          </div>
          <div className='vw grid gap-4 rounded-2xl bg-white p-6 pr-8 pl-8'>
            <div className='font-bold hover:cursor-pointer'>계정</div>
            <div className='h-[1px] w-full bg-[#CFCFCF]' />
            <div className='font-bold hover:cursor-pointer'>도움말</div>
            <div className='h-[1px] w-full bg-[#CFCFCF]' />
            <div className='font-bold hover:cursor-pointer'>개인정보 보호 및 보안</div>
          </div>
        </div>
      </div>
      <div className='text-center text-[#B2B2B2] underline hover:cursor-pointer' onClick={logout}>
        로그아웃
      </div>
    </div>
  );
}
