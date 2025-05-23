import Image from 'next/image';
import { useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';

export default function DrawerItem({
  title,
  img,
  bookmark,
  description,
}: {
  title: string;
  img: string;
  bookmark: boolean;
  description?: string;
}) {
  const [newBookmark, setNewBookmark] = useState(bookmark);

  return (
    <div className='flex flex-row rounded-2xl bg-white p-4'>
      <Image
        style={{ width: '110px', height: '110px' }}
        src={`/images/${img}`}
        width={110}
        height={110}
        alt='image'
        className='rounded-lg object-cover'
      />
      <div className='ml-4 grid w-full gap-1'>
        <div className='flex justify-between'>
          <div className='h-[25] w-12 rounded-sm bg-[#FF751A] p-1 text-center text-[12px] font-bold text-white'>
            오디오
          </div>
          <Image
            className='hover:cursor-pointer'
            style={{ width: '24px', height: '24px' }}
            src={`/images/${newBookmark ? '' : 'un'}bookmark.png`}
            width={24}
            height={24}
            alt='image'
            onClick={() => setNewBookmark(!newBookmark)}
          />
        </div>
        <div className='font-bold'>{title}</div>
        {description ? (
          <div className='text-sm leading-relaxed text-gray-600'>{description}</div>
        ) : (
          <div className='height-10 flex items-center justify-center rounded-full bg-black px-2 text-center font-bold text-white hover:cursor-pointer hover:opacity-70'>
            이야기 재생하기
          </div>
        )}
        {/* <AudioPlayer src='http://example.com/audio.mp3' /> */}
      </div>
    </div>
  );
}
