'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DrawerItem from '@/components/DrawerItem';

// 하드코딩된 북마크 데이터
const bookmarkData = [
  {
    id: 1,
    title: '어린이 손님의 따뜻한 편지',
    description: '공덕역 인근의 "고리 돈까스"는 20년 넘게 지역 주민들의..',
    img: 'image1.jpg',
    bookmark: true,
  },
  {
    id: 2,
    title: '한강 너머로 이어진 큰 언덕',
    description: '공덕동은 단순한 지명이 아닙니다. "은덕기"라는 이름처럼..',
    img: 'image2.png',
    bookmark: true,
  },
  {
    id: 3,
    title: '아리따운 "도화낭자"',
    description: '도화동에는 "도화낭자"라는 전설이 전해집니다. 옛날 이곳에..',
    img: 'image3.png',
    bookmark: true,
  },
];

export default function Bookmark() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-[#F7F4F2]'>
      {/* 헤더 */}
      <div className='flex items-center justify-between bg-[#F7F4F2] px-8 py-8'>
        <button onClick={() => router.back()} className='flex items-center'>
          <Image
            src='/back.svg'
            width={24}
            height={24}
            alt='뒤로가기'
            className='hover:cursor-pointer'
          />
        </button>
        <h1 className='text-lg font-bold text-black'>북마크</h1>
        <div className='w-6' /> {/* 공간 확보를 위한 빈 div */}
      </div>

      {/* 북마크 아이템 리스트 */}
      <div className='px-4 py-2'>
        <div className='grid gap-4'>
          {bookmarkData.map((item) => (
            <DrawerItem
              key={item.id}
              title={item.title}
              description={item.description}
              img={item.img}
              bookmark={item.bookmark}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
