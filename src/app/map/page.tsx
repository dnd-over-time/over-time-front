'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { IoSearch } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

import {
  CurrentMyLocationMarker,
  GeoCoderInfowindow,
  MarkerInfoWindow,
  ClusterMarker10,
  ClusterMarker100,
  ClusterMarker200,
  ClusterMarker500,
  ClusterMarker1000,
} from '@/components/Markers';

import { dummy } from '@/constants/dummy';
import { useGeolocation } from '@/hooks/useGeolocation';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoIosClose, IoMdLocate } from 'react-icons/io';
import Image from 'next/image';
import { DrawerDemo } from '@/components/Drawer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MarkerClustering: any;

type MapType = 'NORMAL' | 'TERRAIN' | 'SATELLITE' | 'HYBRID';

interface Coords {
  lat: number;
  lng: number;
}

interface ClusterMarker {
  getElement(): HTMLElement;
}

const seoulBoundaryCoordinates = {
  north: 37.715133, // 최대 위도
  south: 37.413294, // 최소 위도
  east: 127.269311, // 최대 경도
  west: 126.734086, // 최소 경도
} as const;

export default function Map() {
  const [selectedMapType, setSelectedMapType] = useState<MapType>('NORMAL');
  const [mapCenterCoords, setMapCenterCoords] = useState<Coords | null>(null);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const toiletInfoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);
  const geoCoderInfowindowRef = useRef<naver.maps.InfoWindow | null>(null);
  const markerClusterRef = useRef<any>(null);
  const panoramaRef = useRef<HTMLDivElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const { currentMyCoordinates, geoStatus, getCurPosition } = useGeolocation();

  const router = useRouter();

  // 지도 초기화
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.5759, 126.977),
      zoom: 18,
      minZoom: 8,
      mapDataControl: false,
      disableKineticPan: false,
    });
  }, []);

  // 기존 마커와 클러스터 제거 함수
  const clearMapOverlays = () => {
    if (toiletInfoWindowsRef) {
      toiletInfoWindowsRef.current.forEach((toiletInfoWindow) => toiletInfoWindow.close());
      toiletInfoWindowsRef.current = [];
    }

    if (geoCoderInfowindowRef.current) {
      geoCoderInfowindowRef.current.close();
      geoCoderInfowindowRef.current = null;
    }

    if (markerClusterRef.current) {
      markerClusterRef.current.setMarkers([]);
      markerClusterRef.current.setMap(null);
      markerClusterRef.current = null;
    }
  };

  const searchAddressToCoordinate = (searchAddress: string) => {
    const trimmedSearchAddress = searchAddress.trim();
    if (!trimmedSearchAddress) return;

    naver.maps.Service.geocode({ query: trimmedSearchAddress }, (status, response) => {
      if (!mapRef.current) return;

      const [addresses] = response.v2.addresses;
      const { roadAddress, jibunAddress, englishAddress, x, y } = addresses;
      const searchAddressCoordinate = new naver.maps.LatLng(Number(y), Number(x));

      const geoCoderInfowindow = new naver.maps.InfoWindow({
        content: renderToStaticMarkup(
          <GeoCoderInfowindow
            roadAddress={roadAddress}
            jibunAddress={jibunAddress}
            englishAddress={englishAddress}
          />,
        ),
        anchorSize: {
          width: 12,
          height: 14,
        },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      });

      clearMapOverlays();
      setMapCenterCoords({ lat: Number(y), lng: Number(x) });
      mapRef.current.panTo(searchAddressCoordinate);

      geoCoderInfowindow.open(mapRef.current, searchAddressCoordinate);
      geoCoderInfowindowRef.current = geoCoderInfowindow;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') searchAddressToCoordinate(addressInputRef.current?.value || '');
  };

  const handleSearchClick = () => searchAddressToCoordinate(addressInputRef.current?.value || '');

  const handleMapTypeChange = (mapType: MapType) => {
    if (mapRef.current && selectedMapType !== mapType) {
      mapRef.current.setMapTypeId(naver.maps.MapTypeId[mapType]);
      setSelectedMapType(mapType);
    }
  };

  // 마커 초기화 함수
  const initializeMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const dummyMarkers: naver.maps.Marker[] = [];

    dummy.forEach((item) => {
      const { Y_WGS84, X_WGS84, FNAME, ANAME, DISTANCE, POI_ID } = item;
      console.log(item);
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(Y_WGS84, X_WGS84),
        map: mapRef.current!,
        title: ANAME,
      });
      dummyMarkers.push(marker);

      const infowindowNode = document.createElement('div');
      const root = createRoot(infowindowNode);

      const infoWindow = new naver.maps.InfoWindow({
        content: infowindowNode,
        anchorSize: {
          width: 12,
          height: 14,
        },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      });
      toiletInfoWindowsRef.current.push(infoWindow);

      naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          flushSync(() =>
            root.render(
              <MarkerInfoWindow
                FNAME={FNAME}
                ANAME={ANAME}
                jibunAddress='주소 정보 없음'
                roadAddress='도로명 주소 없음'
                DISTANCE={DISTANCE}
                isSearchAddress={true}
                onClickPanorama={() => router.push(`/${POI_ID}`)}
              />,
            ),
          );

          infoWindow.open(mapRef.current!, marker);
        }
      });
    });

    // 마커 클러스터링
    const clusterMarker10Icon = {
      content: renderToStaticMarkup(<ClusterMarker10 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker100Icon = {
      content: renderToStaticMarkup(<ClusterMarker100 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker200Icon = {
      content: renderToStaticMarkup(<ClusterMarker200 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker500Icon = {
      content: renderToStaticMarkup(<ClusterMarker500 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker1000Icon = {
      content: renderToStaticMarkup(<ClusterMarker1000 />),
      anchor: new naver.maps.Point(12, 12),
    };

    markerClusterRef.current = new MarkerClustering({
      map: mapRef.current,
      markers: dummyMarkers,
      disableClickZoom: false,
      minClusterSize: 5,
      maxZoom: 20,
      gridSize: 150,
      icons: [
        clusterMarker10Icon,
        clusterMarker100Icon,
        clusterMarker200Icon,
        clusterMarker500Icon,
        clusterMarker1000Icon,
      ],
      indexGenerator: [10, 100, 200, 500, 1000],
      averageCenter: false,
      stylingFunction: (clusterMarker: ClusterMarker, count: number) => {
        const el = clusterMarker.getElement().firstChild as HTMLElement | null;
        if (el) el.textContent = String(count);
      },
    });
  }, [router]);

  useEffect(() => {
    if (!mapCenterCoords) return;
  }, [mapCenterCoords]);

  // 현재 위치 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || geoStatus !== 'success' || !currentMyCoordinates) return;

    if (currentLocationMarkerRef.current) currentLocationMarkerRef.current.setMap(null);

    currentLocationMarkerRef.current = new naver.maps.Marker({
      position: new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
      map: mapRef.current,
      icon: {
        content: renderToStaticMarkup(<CurrentMyLocationMarker />),
        anchor: new naver.maps.Point(12, 12),
      },
    });
  }, [currentMyCoordinates, geoStatus, mapCenterCoords]);

  // MarkerClustering 스크립트 로드 완료 후 마커 초기화
  const handleMarkerClusteringLoad = useCallback(() => {
    console.log('MarkerClustering 스크립트가 로드되었습니다.');
    initializeMarkers();
  }, [initializeMarkers]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom + 1, true);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom - 1, true);
    }
  };

  const handleCurrentLocation = () => {
    getCurPosition();

    if (currentMyCoordinates && mapRef.current) {
      if (
        mapCenterCoords &&
        mapCenterCoords.lat === currentMyCoordinates.lat &&
        mapCenterCoords.lng === currentMyCoordinates.lng
      ) {
        // 현재 지도 중심이 내 위치일 때 현재 위치 버튼을 클릭할 경우 지도 중심만 내 위치로 이동
        mapRef.current.panTo(
          new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
        );
      } else {
        // 주소 검색으로 이동한 좌표와 현재 내 위치 좌표가 동일하지 않을 경우 검색한 주소 주변의 마커를 지운 후 내 위치로 이동
        clearMapOverlays();
        setMapCenterCoords(currentMyCoordinates);
        mapRef.current.panTo(
          new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
        );
      }
    }
  };

  const handleBookmark = () => {
    router.push('/bookmark');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <>
      <Script
        src='/MarkerClustering.js'
        strategy='afterInteractive'
        onLoad={handleMarkerClusteringLoad}
        onError={(e) => {
          console.error('MarkerClustering 스크립트 로드에 실패했습니다:', e);
        }}
      />
      <main>
        <div id='map' className='relative h-dvh w-full p-3 focus:outline-none'>
          <div className='absolute top-11 left-3 z-10'>
            <Image
              className={'hover:cursor-pointer'}
              style={{ width: 60, height: 60 }}
              src='/images/button-bookmark.png'
              width={60}
              height={60}
              alt='bookmark'
              onClick={handleBookmark}
            />
          </div>
          <div className='absolute top-11 right-3 z-10'>
            <Image
              className={'hover:cursor-pointer'}
              style={{ width: 38, height: 48 }}
              src='/images/button-profile.png'
              width={38}
              height={49}
              alt='profile'
              onClick={handleProfile}
            />
          </div>
          <div className='absolute right-3 bottom-11 z-10'>
            <button
              className='group mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white shadow-md outline-white'
              onClick={handleCurrentLocation}
              disabled={geoStatus === 'loading'}
            >
              <IoMdLocate className='locateIcon text-gray-700' size={21} />
              <span className='absolute top-[18px] left-[-65px] hidden w-[60px] -translate-y-1/2 rounded-md bg-[#222222] p-1.5 text-center text-xs text-white shadow-md group-hover:block'>
                현재위치
              </span>
            </button>
            <div className='flex flex-col'>
              <button
                className='flex h-9 w-9 items-center justify-center rounded-tl-md rounded-tr-md border-x border-t border-b-[0.5px] border-gray-300 bg-white shadow-md outline-white'
                onClick={handleZoomIn}
              >
                <FiPlus className='locateIcon text-gray-700' size={21} />
              </button>
              <button
                className='flex h-9 w-9 items-center justify-center rounded-br-md rounded-bl-md border-x border-t-[0.5px] border-b border-gray-300 bg-white shadow-md outline-white'
                onClick={handleZoomOut}
              >
                <FiMinus className='locateIcon text-gray-700' size={21} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
