import Image from 'next/image';
import Link from 'next/link';

export default function Step2() {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F7F4F2] px-6'>
      {/* 상단 텍스트 */}
      <div className='font-pretendard mb-24 self-start text-left text-2xl font-bold'>
        <p className='text-gray-800'>바로 이 근처,</p>
        <p className='text-gray-800'>이야기가 숨어 있어요!</p>
      </div>

      {/* 중앙 영역 - 메인 이미지와 발자국 */}
      <div className='mt-2 flex flex-col items-center'>
        {/* 메인 캐릭터 이미지 */}
        <Image
          src='/step2.png'
          alt='이야기 말풍선'
          width={250}
          height={250}
          className='object-contain'
        />

        {/* 발자국 이미지 */}
        <div className='mt-18'>
          <Image
            src='/step2-foot.png'
            alt='발자국'
            width={60}
            height={20}
            className='object-contain'
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className='mt-30 w-full max-w-sm'>
        <Link
          href='/map'
          className='block w-full rounded-full bg-black px-6 py-4 text-center text-sm font-medium text-white'
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
