import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://jun-playground.kro.kr:8088/api/v1/audioguide/markers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('마커 데이터를 가져오는데 실패했습니다:', error);
    return NextResponse.json({ error: '마커 데이터를 가져오는데 실패했습니다' }, { status: 500 });
  }
}
