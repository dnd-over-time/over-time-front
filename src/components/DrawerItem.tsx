import Image from 'next/image';
import { useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';

export default function DrawerItem({
  title,
  bookmark,
  description,
  isAudio,
  mediaUrl,
}: {
  title: string;
  bookmark: boolean;
  description?: string;
  isAudio: boolean;
  mediaUrl: string | null;
}) {
  const [newBookmark, setNewBookmark] = useState(bookmark);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    const audioElement = document.getElementById(title);
    if (audioElement) {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    const audioElement = document.getElementById(title);
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className='flex flex-row rounded-2xl bg-white p-4'>
      {isAudio ? (
        <div className='min-h-[110px] min-w-[110px] rounded-lg bg-black/12'></div>
      ) : (
        <Image
          style={{ width: '110px', height: '110px' }}
          src={mediaUrl || ''}
          width={110}
          height={110}
          alt='image'
          className='rounded-lg object-cover'
        />
      )}

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
          <div>
            {isAudio ? (
              <div>
                <div
                  onClick={isPlaying ? handlePause : handlePlayAudio}
                  className='flex h-10 items-center justify-center rounded-full bg-black px-2 text-center font-bold text-white hover:cursor-pointer hover:opacity-70'
                >
                  이야기 재생하기
                </div>
                <audio id={title} src={mediaUrl} preload='metadata' />
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
