import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { idCode } = await request.json();

    if (!idCode) {
      return NextResponse.json({ error: '인가 코드가 필요합니다.' }, { status: 400 });
    }

    // 백엔드 API 호출
    const response = await fetch('http://jun-playground.kro.kr:8088/v1/allInOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('백엔드 API 에러:', data);
      return NextResponse.json(
        { error: '로그인 처리 실패', details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route 에러:', error);
    return NextResponse.json({ error: '서버 내부 오류' }, { status: 500 });
  }
}
