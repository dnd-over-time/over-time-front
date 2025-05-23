'use client';

import Image from 'next/image';

import { KAKAO_CLIENT_ID, REDIRECT_URI } from '@/constants/auth';

export default function Home() {
  const handleKakaoLogin = () => {
    const scope = ['profile_nickname', 'profile_image'].join(',');

    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}`;
  };

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F7F4F2] px-6'>
      {/* 상단 텍스트들 */}
      <div className='mt-10 mb-24 text-center'>
        <p className='mb-2 text-sm font-bold text-[#ff751a]'>
          현대판 전래동화, 동네에서 듣는 이야기
        </p>
        <h1 className='font-santokki text-5xl font-bold text-[#ff751a]'>동네왔수다</h1>
      </div>

      {/* 중앙 캐릭터 이미지 */}
      <div className='mb-30'>
        <Image
          src='/landing.png'
          alt='동네왔수다 캐릭터'
          className='h-[310px] w-[220px]'
          width={220}
          height={310}
        />
      </div>

      {/* 하단 시작하기 버튼 */}
      <div className='w-full max-w-sm'>
        <button
          onClick={handleKakaoLogin}
          className='flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-medium text-white'
        >
          <Image
            src='/kakao-icon.svg'
            alt='카카오 아이콘'
            width={24}
            height={24}
            className='h-4 w-4'
          />
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
}
