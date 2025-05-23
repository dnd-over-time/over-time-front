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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DrawerDemo({ data }: any) {
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
            {data.map(
              (
                d: {
                  fileExtension: string;
                  mediaUrl: null;
                  name: string;
                },
                i: number,
              ) => (
                <DrawerItem
                  key={i}
                  title={d.name}
                  isAudio={d.fileExtension === 'audio'}
                  mediaUrl={d.mediaUrl}
                  bookmark={i % 3 !== 0}
                />
              ),
            )}
          </div>
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
