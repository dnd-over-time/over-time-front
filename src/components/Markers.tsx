import { useState } from 'react';
import { DrawerDemo } from './Drawer';
import { Drawer } from 'vaul';

interface MarkerInfoWindowProps {
  FNAME: string;
  ANAME: string;
  jibunAddress: string;
  roadAddress: string;
  DISTANCE: number;
  isSearchAddress: boolean;
  onClickPanorama: () => void;
}

interface GeoCoderInfowindowProps {
  roadAddress: string;
  jibunAddress: string;
  englishAddress: string;
}

export function CurrentMyLocationMarker() {
  return (
    <div className='relative flex h-6 w-6 items-center justify-center'>
      <div className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75' />
      <div className='relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' />
    </div>
  );
}

export function MarkerInfoWindow({
  FNAME,
  ANAME,
  jibunAddress,
  roadAddress,
  DISTANCE,
  isSearchAddress,
}: MarkerInfoWindowProps) {
  const [drawer, setDrawer] = useState(350);

  const handleOpenDrawer = (adjustment: number) => {
    setDrawer(Math.max(200, Math.min(400, drawer + adjustment)));
  };

  return (
    <>
      <div className='flex flex-col gap-y-1.5 rounded-md border border-gray-200 bg-white px-5 py-4 whitespace-nowrap shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
        <div className='flex items-center gap-x-2'>
          <p className='text-lg font-bold'>어린이 손님의 따뜻한 편지</p>
        </div>
        <div>
          <p className='text-sm font-medium text-gray-500'>{ANAME}</p>
        </div>
        <div className='flex flex-col gap-y-1'></div>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='text-sm font-medium'>
            {isSearchAddress ? '검색한 주소로부터 약 ' : '현재 위치로부터 약 '}
            <span className='font-bold'>
              {DISTANCE < 1
                ? `${Math.round(DISTANCE * 1000)}m`
                : `${Number(DISTANCE.toFixed(1))}km`}
            </span>
          </div>
          <div className='flex justify-end'>
            <DrawerDemo drawer={drawer} />
          </div>
        </div>
      </div>
    </>
  );
}

export function GeoCoderInfowindow({
  roadAddress,
  jibunAddress,
  englishAddress,
}: GeoCoderInfowindowProps) {
  return (
    <div className='flex flex-col gap-y-1.5 rounded-md border border-gray-200 bg-white px-5 py-4 whitespace-nowrap shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
      <p className='text-lg font-bold'>{roadAddress}</p>
      {jibunAddress && roadAddress !== jibunAddress && (
        <div className='text-sm font-medium'>
          <span className='mr-1.5 rounded border border-gray-400 px-1 py-0.5 text-xs font-semibold text-gray-700'>
            지번
          </span>
          {jibunAddress}
        </div>
      )}
      {jibunAddress && (
        <div className='text-sm font-medium'>
          <span className='mr-1.5 rounded border border-gray-400 px-1 py-0.5 text-xs font-semibold text-gray-700'>
            영문
          </span>
          {englishAddress}
        </div>
      )}
    </div>
  );
}

export function ClusterMarker10() {
  return (
    <div className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker100() {
  return (
    <div className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker200() {
  return (
    <div className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker500() {
  return (
    <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-emerald-800 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker1000() {
  return (
    <div className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-emerald-900 text-xs font-semibold text-white' />
  );
}
