import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    const response = await fetch(
      `http://jun-playground.kro.kr:8088/api/contents/markingList/${userId}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('북마크 데이터를 가져오는데 실패했습니다:', error);
    return NextResponse.json({ error: '북마크 데이터를 가져오는데 실패했습니다' }, { status: 500 });
  }
}
