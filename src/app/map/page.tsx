'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

import {
  CurrentMyLocationMarker,
  MarkerInfoWindow,
  ClusterMarker10,
  ClusterMarker100,
  ClusterMarker200,
  ClusterMarker500,
  ClusterMarker1000,
} from '@/components/Markers';

import { fetchMarkerData, MarkerData } from '@/constants/dummy';
import { useGeolocation } from '@/hooks/useGeolocation';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoMdLocate } from 'react-icons/io';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MarkerClustering: any;

export interface Coords {
  lat: number;
  lng: number;
}

interface ClusterMarker {
  getElement(): HTMLElement;
}

export default function Map() {
  const [mapCenterCoords, setMapCenterCoords] = useState<Coords | null>(null);
  const [markerData, setMarkerData] = useState<MarkerData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const toiletInfoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);
  const geoCoderInfowindowRef = useRef<naver.maps.InfoWindow | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerClusterRef = useRef<any>(null);

  const { currentMyCoordinates, geoStatus, getCurPosition } = useGeolocation();

  const router = useRouter();

  // API에서 마커 데이터 가져오기
  useEffect(() => {
    const loadMarkerData = async () => {
      const data = await fetchMarkerData();
      setMarkerData(data);
      setIsDataLoaded(true);
    };

    loadMarkerData();
  }, []);

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

  // 마커 초기화 함수
  const initializeMarkers = useCallback(() => {
    if (!mapRef.current || !isDataLoaded || markerData.length === 0) return;

    const dummyMarkers: naver.maps.Marker[] = [];

    markerData.forEach((item) => {
      const { latitude, longitude, locationName, address, markerRowId } = item;
      console.log(item);
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map: mapRef.current!,
        title: locationName,
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
                FNAME={address}
                ANAME={locationName}
                jibunAddress={address}
                roadAddress={address}
                DISTANCE={0}
                isSearchAddress={true}
                onClickPanorama={() => router.push(`/${markerRowId}`)}
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
  }, [router, markerData, isDataLoaded]);

  useEffect(() => {
    if (!mapCenterCoords) return;
  }, [mapCenterCoords]);

  // 마커 데이터가 로드된 후 마커 초기화
  useEffect(() => {
    if (isDataLoaded && isScriptLoaded && markerData.length > 0) {
      initializeMarkers();
    }
  }, [isDataLoaded, isScriptLoaded, markerData, initializeMarkers]);

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
    setIsScriptLoaded(true);
  }, []);

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
