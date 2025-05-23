'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DrawerItem from '@/components/DrawerItem';
import { useEffect, useState } from 'react';

// 북마크 아이템 타입 정의
interface BookmarkItem {
  id: number | string;
  name: string;
  description: string;
  img: string;
  bookmark: boolean;
}

// API 응답 아이템 타입 (실제 API 구조에 맞게 정의)
interface ApiBookmarkItem {
  contentRowId?: number;
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  img?: string;
  image?: string;
  bookmark?: boolean;
  [key: string]: unknown; // 추가 속성들을 위한 인덱스 시그니처
}

export default function Bookmark() {
  const [bookmarkData, setBookmarkData] = useState<BookmarkItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    const getBookmarkData = async () => {
      const storedUserInfo = localStorage.getItem('loginData');
      if (storedUserInfo) {
        try {
          const response = await fetch(
            'http://jun-playground.kro.kr:8088/api/contents/markingList/9',
          );
          const data: ApiBookmarkItem[] = await response.json();
          console.log('API 응답 데이터:', data);

          // 데이터 정규화: 필요한 속성들에 기본값 제공
          const normalizedData: BookmarkItem[] = data.map((item, index) => ({
            id: item.contentRowId || item.id || index,
            name: item.name || item.title || '제목 없음',
            description: item.description || '설명 없음',
            img: item.img || item.image || 'image1.jpg',
            bookmark: item.bookmark !== undefined ? item.bookmark : true,
          }));

          setBookmarkData(normalizedData);
        } catch (error) {
          console.error('북마크 데이터를 가져오는데 실패했습니다:', error);
          setBookmarkData([]);
        }
      }
    };

    getBookmarkData();
  }, []);

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
              title={item.name}
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
