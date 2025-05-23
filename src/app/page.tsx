'use client';

import { useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

import {
  MarkerInfoWindow,
  ClusterMarker10,
  ClusterMarker100,
  ClusterMarker200,
  ClusterMarker500,
  ClusterMarker1000,
} from '@/components/Markers';

import { dummy } from '@/constants/dummy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MarkerClustering: any;

interface ClusterMarker {
  getElement(): HTMLElement;
}

export default function Map() {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const toiletInfoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerClusterRef = useRef<any>(null);

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

  // 마커 초기화 함수
  const initializeMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const dummyMarkers: naver.maps.Marker[] = [];

    dummy.forEach((item) => {
      const { Y_WGS84, X_WGS84, FNAME, ANAME, DISTANCE, POI_ID } = item;

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

  // MarkerClustering 스크립트 로드 완료 후 마커 초기화
  const handleMarkerClusteringLoad = useCallback(() => {
    console.log('MarkerClustering 스크립트가 로드되었습니다.');
    initializeMarkers();
  }, [initializeMarkers]);

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
      <div id='map' className='relative h-dvh w-full p-3 focus:outline-none' />
    </>
  );
}
