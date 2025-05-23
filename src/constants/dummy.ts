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

// API에서 받아올 마커 데이터 타입
export interface MarkerData {
  markerRowId: number;
  latitude: number;
  longitude: number;
  locationName: string;
  address: string;
  contentCount: number;
  createdAt: string;
}

// API에서 마커 데이터를 가져오는 함수
export const fetchMarkerData = async (): Promise<MarkerData[]> => {
  try {
    const response = await fetch('/api/markers');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('마커 데이터를 가져오는데 실패했습니다:', error);
    return [];
  }
};

// 더미 화장실 데이터 생성 (청와대 근처 지역)
export const dummy: Toilet[] = [
  {
    POI_ID: '1',
    ANAME: '경복궁 공중화장실',
    CENTER_X1: 126.977,
    CENTER_Y1: 37.5759,
    CNAME: '종로구',
    FNAME: '경복궁역 3번 출구 앞',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.977,
    Y_WGS84: 37.5759,
    DISTANCE: 0.1,
  },
  {
    POI_ID: '2',
    ANAME: '삼청동 공중화장실',
    CENTER_X1: 126.982,
    CENTER_Y1: 37.58,
    CNAME: '종로구',
    FNAME: '삼청동길 중앙',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.982,
    Y_WGS84: 37.58,
    DISTANCE: 0.2,
  },
  {
    POI_ID: '3',
    ANAME: '안국동 공중화장실',
    CENTER_X1: 126.985,
    CENTER_Y1: 37.575,
    CNAME: '종로구',
    FNAME: '안국역 1번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.985,
    Y_WGS84: 37.575,
    DISTANCE: 0.3,
  },
  {
    POI_ID: '4',
    ANAME: '종로3가 공중화장실',
    CENTER_X1: 126.991,
    CENTER_Y1: 37.57,
    CNAME: '종로구',
    FNAME: '종로3가역 5번 출구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.991,
    Y_WGS84: 37.57,
    DISTANCE: 0.4,
  },
  {
    POI_ID: '5',
    ANAME: '광화문 공중화장실',
    CENTER_X1: 126.9769,
    CENTER_Y1: 37.572,
    CNAME: '종로구',
    FNAME: '광화문광장 근처',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.9769,
    Y_WGS84: 37.572,
    DISTANCE: 0.5,
  },
  {
    POI_ID: '6',
    ANAME: '청와대 사랑채 공중화장실',
    CENTER_X1: 126.998,
    CENTER_Y1: 37.584,
    CNAME: '종로구',
    FNAME: '청와대 사랑채 앞',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.998,
    Y_WGS84: 37.584,
    DISTANCE: 0.6,
  },
  {
    POI_ID: '7',
    ANAME: '북촌한옥마을 공중화장실',
    CENTER_X1: 126.984,
    CENTER_Y1: 37.582,
    CNAME: '종로구',
    FNAME: '북촌한옥마을 입구',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.984,
    Y_WGS84: 37.582,
    DISTANCE: 0.7,
  },
  {
    POI_ID: '8',
    ANAME: '효자동 공중화장실',
    CENTER_X1: 126.97,
    CENTER_Y1: 37.578,
    CNAME: '종로구',
    FNAME: '효자동 주민센터 앞',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.97,
    Y_WGS84: 37.578,
    DISTANCE: 0.8,
  },
  {
    POI_ID: '9',
    ANAME: '서촌 공중화장실',
    CENTER_X1: 126.965,
    CENTER_Y1: 37.576,
    CNAME: '종로구',
    FNAME: '서촌 통인시장 근처',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.965,
    Y_WGS84: 37.576,
    DISTANCE: 0.9,
  },
  {
    POI_ID: '10',
    ANAME: '창덕궁 공중화장실',
    CENTER_X1: 126.991,
    CENTER_Y1: 37.579,
    CNAME: '종로구',
    FNAME: '창덕궁 정문 앞',
    INSERTDATE: '2024-01-01',
    UPDATEDATE: '2024-01-01',
    X_WGS84: 126.991,
    Y_WGS84: 37.579,
    DISTANCE: 1.0,
  },
];
