'use client';

import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';

import {
  MarkerInfoWindow,
  ClusterMarker10,
  ClusterMarker100,
  ClusterMarker200,
  ClusterMarker500,
  ClusterMarker1000,
} from '@/components/Markers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MarkerClustering: any;

interface Toilet {
  POI_ID: string;
  ANAME: string;
  CENTER_X1: number;
  CENTER_Y1: number;
  CNAME: string;
  FNAME: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  X_WGS84: number;
  Y_WGS84: number;
  DISTANCE: number;
}

interface ClusterMarker {
  getElement(): HTMLElement;
}

// 더미 화장실 데이터 생성
const toiletsWithDistance: Toilet[] = [
  {
    POI_ID: '1',
    ANAME: '강남역 공중화장실',
    CENTER_X1: 127.0276,
    CENTER_Y1: 37.4979,
    CNAME: '강남구',
    FNAME: '강남역 1번 출구 앞',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 127.0276,
    Y_WGS84: 37.4979,
    DISTANCE: 0.1,
  },
  {
    POI_ID: '2',
    ANAME: '홍대입구역 공중화장실',
    CENTER_X1: 126.9244,
    CENTER_Y1: 37.5563,
    CNAME: '마포구',
    FNAME: '홍대입구역 9번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.9244,
    Y_WGS84: 37.5563,
    DISTANCE: 0.2,
  },
  {
    POI_ID: '3',
    ANAME: '명동 공중화장실',
    CENTER_X1: 126.9834,
    CENTER_Y1: 37.5636,
    CNAME: '중구',
    FNAME: '명동 중앙로',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.9834,
    Y_WGS84: 37.5636,
    DISTANCE: 0.3,
  },
  {
    POI_ID: '4',
    ANAME: '이태원 공중화장실',
    CENTER_X1: 126.9944,
    CENTER_Y1: 37.5344,
    CNAME: '용산구',
    FNAME: '이태원역 1번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.9944,
    Y_WGS84: 37.5344,
    DISTANCE: 0.4,
  },
  {
    POI_ID: '5',
    ANAME: '인사동 공중화장실',
    CENTER_X1: 126.9856,
    CENTER_Y1: 37.5717,
    CNAME: '종로구',
    FNAME: '인사동길 중앙',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.9856,
    Y_WGS84: 37.5717,
    DISTANCE: 0.5,
  },
  {
    POI_ID: '6',
    ANAME: '동대문 공중화장실',
    CENTER_X1: 127.0088,
    CENTER_Y1: 37.5665,
    CNAME: '중구',
    FNAME: '동대문역 1번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 127.0088,
    Y_WGS84: 37.5665,
    DISTANCE: 0.6,
  },
  {
    POI_ID: '7',
    ANAME: '잠실 공중화장실',
    CENTER_X1: 127.1028,
    CENTER_Y1: 37.5133,
    CNAME: '송파구',
    FNAME: '잠실역 2번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 127.1028,
    Y_WGS84: 37.5133,
    DISTANCE: 0.7,
  },
  {
    POI_ID: '8',
    ANAME: '여의도 공중화장실',
    CENTER_X1: 126.9245,
    CENTER_Y1: 37.5219,
    CNAME: '영등포구',
    FNAME: '여의도역 3번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.9245,
    Y_WGS84: 37.5219,
    DISTANCE: 0.8,
  },
  {
    POI_ID: '9',
    ANAME: '신촌 공중화장실',
    CENTER_X1: 126.9425,
    CENTER_Y1: 37.5591,
    CNAME: '서대문구',
    FNAME: '신촌역 2번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.9425,
    Y_WGS84: 37.5591,
    DISTANCE: 0.9,
  },
  {
    POI_ID: '10',
    ANAME: '건대입구 공중화장실',
    CENTER_X1: 127.0695,
    CENTER_Y1: 37.5401,
    CNAME: '광진구',
    FNAME: '건대입구역 6번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 127.0695,
    Y_WGS84: 37.5401,
    DISTANCE: 1.0,
  },
];

export default function Map() {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const toiletInfoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerClusterRef = useRef<any>(null);

  // 지도 초기화
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.564214, 127.001699),
      zoom: 18,
      minZoom: 8,
      mapDataControl: false,
      disableKineticPan: false,
    });
  }, []);

  // 마커 렌더링 및 클러스터링
  useEffect(() => {
    if (!mapRef.current) return;

    const toiletMarkers: naver.maps.Marker[] = [];

    toiletsWithDistance.forEach((toilet) => {
      const { Y_WGS84, X_WGS84, FNAME, ANAME, DISTANCE } = toilet;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(Y_WGS84, X_WGS84),
        map: mapRef.current!,
        title: ANAME,
      });
      toiletMarkers.push(marker);

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
                onClickPanorama={() => console.log('버튼 클릭')}
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
      markers: toiletMarkers,
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
  }, []);

  return <div id='map' className='relative h-dvh w-full p-3 focus:outline-none' />;
}
