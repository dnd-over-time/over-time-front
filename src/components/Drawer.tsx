'use client';

import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import DrawerItem from './DrawerItem';
import Image from 'next/image';

export function DrawerDemo({ drawer }: { drawer: number }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div>
          <Image
            className='hover:cursor-pointer'
            src='/images/audio.png'
            height={40}
            width={40}
            style={{ height: 40, width: 40 }}
            alt='audio'
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className='bg-[#F2F2F2]'>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader>
            <DrawerTitle className='text-[18px] font-bold'>내 주변의 이야기</DrawerTitle>
          </DrawerHeader>
          <div className='grid gap-4 p-4 pb-0'>
            <DrawerItem title='어린이 손님의 따뜻한 편지' img={'image1.jpg'} bookmark />
            <DrawerItem title='한강 너머로 이어진 큰 언덕' img={'image2.png'} bookmark />
            <DrawerItem title="아리따운 '도화낭자" img={'image3.png'} bookmark={false} />
          </div>
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
