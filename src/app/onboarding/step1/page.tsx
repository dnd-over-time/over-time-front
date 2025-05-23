import Image from 'next/image';
import Link from 'next/link';

export default function Step1() {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F7F4F2] px-6'>
      {/* 상단 텍스트 */}
      <div className='font-pretendard mb-24 self-start text-left text-2xl font-bold'>
        <p className='text-gray-800'>마음에 남아 있는,</p>
        <p className='text-gray-800'>동네의 순간을 기록해보세요.</p>
      </div>

      {/* 중앙 영역 - 메인 이미지와 발자국 */}
      <div className='flex flex-col items-center'>
        {/* 메인 캐릭터 이미지 */}
        <Image
          src='/step1.png'
          alt='마음에 남은 순간을 기록하는 캐릭터'
          width={250}
          height={250}
          className='object-contain'
        />

        {/* 발자국 이미지 */}
        <div className='mt-10'>
          <Image
            src='/step1-foot.png'
            alt='발자국'
            width={60}
            height={20}
            className='object-contain'
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className='mt-23 w-full max-w-sm'>
        <Link
          href='/onboarding/step2'
          className='block w-full rounded-full bg-black px-6 py-4 text-center text-sm font-medium text-white'
        >
          다음
        </Link>
      </div>
    </div>
  );
}
