'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchKakaoLogin = async () => {
      try {
        // 1-6. Kakao Auth Server는 Service Client의 302 Redirect URI로 인가 코드 전달
        // http://localhost:3000/login/callback?code='인가 코드' 형식으로 전달
        const code = searchParams.get('code');
        console.log('카카오 인가 코드:', code);

        if (code) {
          // 백엔드 allInOne POST API로 통합 처리
          const response = await fetch(`http://jun-playground.kro.kr:8088/v1/allInOne`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idCode: code }),
          });

          const data = await response.json();
          console.log('백엔드 응답:', data);

          if (!response.ok) {
            console.error('API 에러 응답:', data);
            throw new Error(`로그인 처리 실패: ${response.status} - ${JSON.stringify(data)}`);
          }

          // 로컬에 저장
          localStorage.setItem('loginData', JSON.stringify(data));

          // 로그인 완료 후 메인 페이지로 이동
          router.push('/onboarding/step1');
        }
      } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        router.push('/');
      }
    };

    fetchKakaoLogin();
  }, [searchParams, router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <p>로그인 처리 중...</p>
    </div>
  );
}

export default function KakaoCallback() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <p>로딩 중...</p>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
